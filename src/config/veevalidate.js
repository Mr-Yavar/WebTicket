import {
    Form as VeeForm,
    Field as VeeField,
    defineRule,
    ErrorMessage,
    configure,
} from "vee-validate";
import {
    required,
    min,
    max,
    alpha_spaces as alphaSpaces,
    email,
    min_value as minVal,
    max_value as maxVal,
    confirmed,
    not_one_of as excluded,
    alpha_dash,

} from "@vee-validate/rules";

const FaNames = {
    firstName: "نام",
    lastName: "نام خانوادگی",
    userName: "نام کاربری",
    email: "ایمیل",
    gender: "جنسیت",
    phoneNumber: "شماره تماس",
    password: "رمز عبور",
    confirm_password: "تکرار رمز"
}


export default {
    install(app) {
        app.component("VeeForm", VeeForm);
        app.component("VeeField", VeeField);
        app.component("ErrorMessage", ErrorMessage);

        defineRule("required", required);
        defineRule("tos", required);
        defineRule("min", min);
        defineRule("max", max);
        defineRule("alpha_spaces", alphaSpaces);
        defineRule("alpha_dash", alpha_dash);
        defineRule("email", email);
        defineRule("min_value", minVal);
        defineRule("max_value", maxVal);
        defineRule("passwords_mismatch", confirmed);
        defineRule("excluded", excluded);
        defineRule("country_excluded", excluded);
        defineRule('persian_text', value => {
            var persianText = /^[\u0600-\u06FF\s]+$/;

            if (!persianText.test(value)) {
                return false;
            }
            return true;
        });
        defineRule('username', value => {
            console.log(value);
            var username = /^[A-Za-z]{1}[A-Za-z,_0-9]{2,20}$/;

            if (!username.test(value)) {
                return false;
            }
            return true;
        });
        defineRule('phone_number', value => {
            console.log(value);
            var username = /^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/;

            if (!username.test(value)) {
                return false;
            }
            return true;
        });


        configure({
            generateMessage: (ctx) => {
                const messages = {
                    required: `فیلد  ${FaNames[ctx.field]} الزامی است`,
                    min: `${FaNames[ctx.field]}  خیلی کوتاه است! `,
                    max: `${FaNames[ctx.field]}  طولانی است! `,
                    alpha_spaces: `فیلد${FaNames[ctx.field]}صرفا میتواند شامل فاصله و حروف الفبای انگلیسی باشد!   `,
                    alpha_dash: `فیلد${FaNames[ctx.field]}صرفا میتواند شامل _ و حروف الفبای انگلیسی باشد!   `,
                    email: `فیلد${FaNames[ctx.field]} باید از فرمت ایمیل تبعیت کند!   `,
                    username : `فیلد${FaNames[ctx.field]}  باید شامل حروف انگلیسی و اعداد و _ باشد!`,
                    min_value: ` مقدار فیلد${FaNames[ctx.field]} کمتر از حد مجاز است!  `,
                    max_value: `مقدار فیلد${FaNames[ctx.field]}  بیشتر از حد مجاز است!  `,
                    excluded: `در فیلد${FaNames[ctx.field]} مجاز به ثبت این مدار نیستید!   `,
                    country_excluded:
                        "Due to restrictions, we do not accept users from this location.",
                    passwords_mismatch: "رمز عبور و تکرار آن یکسان نیستند!",
                    tos: "You must accept the Terms of Service.",
                    persian_text : "صرفا حروف الفبای فارسی مجاز است!",
                    phone_number : "مقدار وارد شده شماره موبایل نیست!"
                };

                const message = messages[ctx.rule.name]
                    ? messages[ctx.rule.name]
                    : `فیلد ${FaNames[ctx.field]} معتبر نیست !`;

                return message;
            },
            validateOnBlur: true,
            validateOnChange: true,
            validateOnInput: false,
            validateOnModelUpdate: true,
        });
    },
};
