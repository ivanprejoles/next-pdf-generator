import { toast } from "react-toastify"

const toastSuccess = (text: string) => {
    toast.success(text)
}

const toastError = (text: string) => {
    toast.error(text)
}

const toastWarning = (text:  string) => {
    toast.warning(text,
        {
            autoClose: 3000
        }
    )
}

const toastLoading = (text: string) => {
    toast.loading(text, {
        autoClose: false,
        closeButton: false,
        closeOnClick: false
    })
}

const toastDismiss = (toastID: any) => {
    toast.dismiss(toastID)
}

export {
    toastSuccess,
    toastError,
    toastWarning,
    toastLoading,
    toastDismiss
}
