import ajax from '@/rest/ajax';
import md5 from '@/utils/md5';

export default {
  data() {
    return {
      // customerShareData: {},
      // customerCoupon: {},
      // promoterId: '',
      // p: 0,
      // dataSource: 3, //分享券来源
    };
  },
  methods: {
    gotoFaceLive() {
      const person_info = localStorage.getItem('person_info');
      const personInfo = JSON.parse(person_info);

      const appid = 'ry91863kGesF16ud';
      const app_security = 'ry91863kGesF16udcjdNh4wVtheMJ0Kd';
      // const callbackUrl = 'http://192.168.0.155:8885/livingBodyCallback';
      const callbackUrl = `${window.location.origin}/livingBodyCallback`;
      const returnUrl = window.location.href;
      const complexity = '1';
      const timestamp = new Date().getTime();
      const sign = md5.hex_md5(`${appid}&${timestamp}&${app_security}`);
      const uid = personInfo.merchantId;
      const title = '账无忧';

      localStorage.setItem('faceLiving', new Date().getTime());
      location.href = `https://lifeh5.shumaidata.com/index.html#/?appid=${appid}&callbackUrl=${callbackUrl}&returnUrl=${returnUrl}&complexity=${complexity}&timestamp=${timestamp}&sign=${sign}&uid=${uid}&title=${title}`;
    },
    async checkLivingBody() {
      const faceLiving = localStorage.getItem('faceLiving') || 0;
      if (new Date().getTime() - faceLiving < 1000 * 60 * 10) {
        // this.initDataByStorage();
        localStorage.removeItem('faceLiving');
        const livingQueryData = await this.livingBodyQuery();
        if (!livingQueryData) return;
        if (!livingQueryData.passed) {
          this.$toast.text('人脸检测不通过，请重试');
          return;
        }
        const featureImage = await this.getBase64Image(
          `https://api.shumaidata.com/v2/life/check/image?imageId=${livingQueryData.feature_image_id}`
        );
        const livingCheckData = await this.livingBodyCheck(featureImage);
        if (livingCheckData.code == 200) {
          this.$router.go(0);
        }
      }
    },
    livingBodyQuery() {
      return new Promise((resolve, reject) => {
        const person_info = localStorage.getItem('person_info');
        const personInfo = JSON.parse(person_info);
        const params = {
          uid: personInfo.merchantId,
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
              // this.$toast.text(res.msg);
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
              resolve(res.data);
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
  },
};
