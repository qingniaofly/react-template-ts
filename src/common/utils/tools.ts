/* eslint-disable prettier/prettier */
// eslint-desable
export function formatMoney(s: string, n = 0) {
    n = n > 0 && n <= 20 ? n : 2
    s = `${parseFloat((`${s}`).replace(/[^\d\.-]/g, "")).toFixed(n)}`
    const l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1]
    let t = ""

    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? "," : "")
    }

    return `${t.split("").reverse().join("")}.${r}`
}; // 格式化事件