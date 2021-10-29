const largeFormLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
} as const

const smallFormLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4, offset: 1 }
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 15 } }
} as const

const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 5 }
    }
} as const

const eamslabelLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5, offset: 2 }
    }
} as const

export const useFormItemLayout = (size?: "small" | "middle" | "large") => {
    switch (size) {
        case "small":
        case "middle":
            return { formLayout: smallFormLayout }

        default:
            return { formLayout: largeFormLayout, formItemLayout: tailFormItemLayout, labelLayout: eamslabelLayout }
    }
}
