exports.filterObj = (obj, notToInclude) => {
    return Object.entries(obj).reduce((acc, [key, val]) => {
        if (!notToInclude.includes(key)) {
            return { ...acc, [key]: val }
        }
        return acc;
    }, {});
};

exports.filterErrors = errors => Object.entries(errors).map(prob => prob[1].message);