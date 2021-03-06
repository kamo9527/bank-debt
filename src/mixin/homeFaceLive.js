import ajax from '@/rest/ajax';
import md5 from '@/utils/md5';

export default {
  data() {
    return {
      uid: '',
    };
  },
  methods: {
    gotoFaceLive() {
      const appid = 'ry91863kGesF16ud';
      const app_security = 'ry91863kGesF16udcjdNh4wVtheMJ0Kd';
      // const callbackUrl = 'http://120.79.102.97:9000/livingBodyCallback';
      // const callbackUrl = 'http://newpay.kuaikuaifu.net/livingBodyCallback';
      // const callbackUrl = 'http://newpay.kuaikuaifu.net/livingBodyCallback';
      const callbackUrl = `${window.location.origin}/livingBodyCallback`;

      const returnUrl = encodeURIComponent(window.location.href);
      const complexity = '1';
      const timestamp = new Date().getTime();
      const sign = md5.hex_md5(`${appid}&${timestamp}&${app_security}`);
      const uid =
        'zhaih' +
        Math.random()
          .toString(36)
          .substr(2);
      const title = '账无忧';

      localStorage.setItem(
        'faceLiving',
        JSON.stringify({
          t: new Date().getTime(),
          uid,
        })
      );
      location.href = `https://lifeh5.shumaidata.com/index.html#/?appid=${appid}&callbackUrl=${callbackUrl}&returnUrl=${returnUrl}&complexity=${complexity}&timestamp=${timestamp}&sign=${sign}&uid=${uid}&title=${title}`;
    },
    checkLivingBody() {
      return new Promise(async (resolve, reject) => {
        const faceLivingStr = localStorage.getItem('faceLiving') || null;
        const faceLiving = JSON.parse(faceLivingStr);
        if (!faceLiving) return;
        const faceLivingTime = faceLiving.t || 0;
        if (
          faceLiving &&
          new Date().getTime() - faceLivingTime < 1000 * 60 * 10
        ) {
          this.uid = faceLiving.uid;
          localStorage.removeItem('faceLiving');
          const livingQueryData = await this.livingBodyQuery();
          if (!livingQueryData) {
            // this.$toast.text('人脸识别结果已失效，请重试');
            return;
          }
          if (!livingQueryData.passed) {
            this.$toast.text('人脸检测不通过，请重试');
            return;
          }

          const featureImage = await this.getBase64Image(
            `https://api.shumaidata.com/v2/life/check/image?imageId=${livingQueryData.feature_image_id}`
          );
          const livingCheckData = await this.livingBodyCheck(featureImage);
          if (livingCheckData.code == 200) {
            const updateOcrResult = await this.updateOcrResult();
            if (updateOcrResult.code == 0) {
              this.$router.push('/card_collection');
            }
            await this.updateAccountInfo();
          }
          resolve('');
        } else {
          reject('');
        }
      }).catch(e => {
        console.log(e);
      });
    },
    livingBodyQuery() {
      return new Promise((resolve, reject) => {
        // const person_info = localStorage.getItem('person_info');
        // const personInfo = JSON.parse(person_info);
        const params = {
          uid: this.uid,
        };
        ajax
          .post('/livingBodyQuery', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data);
            } else {
              this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch(() => {
            reject('');
          });
      });
    },
    livingBodyCheck(image) {
      return new Promise((resolve, reject) => {
        const merchantDebitQueryResult_str = localStorage.getItem(
          'merchantDebitQueryResult'
        );
        const merchantDebitQueryResult = JSON.parse(
          merchantDebitQueryResult_str
        );
        const params = {
          idCardNo: merchantDebitQueryResult.identity,
          name: merchantDebitQueryResult.bankAccountName,
          image,
        };
        ajax
          .post('/livingBodyCheck', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              // resolve(res.data);
              const score = res.data.data.score;
              if (score >= 0.45) {
                resolve(res.data);
              } else {
                this.$toast.text(res.data.data.msg);
                resolve('');
              }
            } else {
              resolve('');
            }
          })
          .catch(() => {
            reject('');
          });
      });
    },
    getBase64Image(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
          const data = getBase64Image(img);
          resolve(data);
        };
        img.onerror = function(err) {
          reject(err);
        };
        img.src = url;

        function getBase64Image(img) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const dataURL = canvas.toDataURL('image/png');
          return dataURL;
          // return dataURL.replace("data:image/png;base64,", "");
        }
      });
    },
    updateOcrResult() {
      return new Promise((resolve, reject) => {
        const params = {
          ocrStatus: true,
        };
        ajax
          .post('/account/updateOcrResult', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              resolve(res);
            } else {
              resolve('');
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
    updateAccountInfo() {
      return new Promise((resolve, reject) => {
        ajax
          .post('/account/info', {})
          .then(res => {
            if (res.code === 0) {
              const {
                merchantInfoQueryResult,
                merchantDebitQueryResult,
              } = res.data;
              this.auditStatus = merchantInfoQueryResult.auditStatus;
              this.ocrStatus = merchantInfoQueryResult.ocrStatus;
              localStorage.setItem(
                'merchantDebitQueryResult',
                JSON.stringify(merchantDebitQueryResult)
              );
              localStorage.setItem(
                'merchantInfoQueryResult',
                JSON.stringify(merchantInfoQueryResult)
              );
              resolve(res.data);
            } else {
              resolve('');
              // this.$toast.text(res.msg);
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
  },
};
