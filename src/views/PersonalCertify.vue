<template>
  <section class="page_w personal_info">
    <div class="page_title">实名认证</div>
    <div class="pd_15">
      <div class="debt_info more_mb">
        <div class="xxx">完成实名认证可以至少降低您负债的30%利息</div>
        <div class="sss">(*请输入办理手机号的身份证号码与姓名)</div>
        <nut-textinput
          class="new_input_item"
          v-for="{ key, tips, disabled } in verifyList"
          :key="key"
          :label="tips"
          :disabled="disabled"
          :placeholder="`请输入您的${tips}`"
          v-model="formData[key]"
        />
        <div class="my_tips">
          <input
            class="my_checkbox middle"
            type="checkbox"
            name="vehicle"
            checked="checked"
            @change="handleRead"
          />
          <span class="middle">同意并授权</span>
          <router-link to="/agreement3" class="contract middle">
            《债惠服务委托协议》
          </router-link>
        </div>
      </div>
    </div>
    <div class="foot_btn">
      <button @click="handleSubmit" class="my_btn my_btn_single my_btn_active">
        提交
      </button>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
import cache from '@/utils/cache';
import { regexpMap } from '@/utils/common.js';

export default {
  name: 'PersonalCertify',
  data() {
    return {
      isRead: true,
      formData: {
        name: '',
        mobile: '',
        idCard: '',
      },
      verifyList: [
        {
          key: 'mobile',
          tips: '手机号码',
          regexp: 'regexp_mobile',
          disabled: true,
        },
        {
          key: 'idCard',
          tips: '身份证号',
          regexp: 'regexp_Identification_card',
          disabled: false,
        },
        {
          key: 'name',
          tips: '姓名',
          regexp: 'regexp_name_cn',
          disabled: false,
        },
      ],
    };
  },
  mounted() {
    const sessionData = cache.getSessionData('person_info');
    if (sessionData) {
      this.formData = sessionData;
    }
  },
  methods: {
    handleRead(e) {
      this.isRead = e.target.checked;
    },
    handleSubmit() {
      if (!this.isRead) {
        this.$toast.text('请阅读并同意债惠服务委托协议');
        return;
      }
      const checkNull = this.verifyList.find(({ key }) => !this.formData[key]);
      if (checkNull) {
        this.$toast.text('请输入' + checkNull.tips);
        return;
      }
      const verifyItem = this.verifyList.find(({ key, regexp }) => {
        return !regexpMap[regexp].test(this.formData[key]);
      });
      if (verifyItem) {
        this.$toast.text(verifyItem.tips + '格式错误');
        return;
      }
      ajax.post('/f3/validate', this.formData).then(res => {
        if (res.code === 0) {
          const { code, msg, data } = res.data;
          this.$toast.text(msg);
          if (code !== -1) {
            const { idCard, name, status } = data;
            const sessionData = cache.getSessionData('person_info');
            Object.assign(sessionData, { idCard, name, status });
            cache.setSessionData('person_info', sessionData);
            this.$router.push('home');
          }
        }
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.personal_info {
  .debt_info {
    background-color: #fff;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    text-align: center;
    .xxx {
      color: #8f6b2e;
      font-size: 14px;
      padding: 6px;
    }
    .sss {
      color: #f72c29;
      font-size: 13px;
      padding-bottom: 10px;
    }
  }
  .more_mb {
    margin-top: -40px;
    justify-content: flex-start;

    .avater {
      display: block;
      width: 60px;
      height: 60px;
      background-color: #eeeeee;
      border-radius: 50%;
      margin-right: 15px;
    }
    .name {
      font-size: 17px;
      color: #999;
    }
  }
  .my_cell {
    height: 40px;
    border-bottom: 1px solid #d4caca;
  }
  .new_input_item {
    padding: 8px 0;
  }
  .new_input_item .nut-textinput-label {
    width: 80px;
    // text-align: right;
  }
}
</style>
