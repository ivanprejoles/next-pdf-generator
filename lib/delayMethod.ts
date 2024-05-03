const delayFunction = (milliseconds: any) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default delayFunction