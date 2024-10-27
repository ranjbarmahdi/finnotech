export default class UserUtils {
    static generateCode(digit) {
        return Math.floor(10 ** (digit - 1) + Math.random() * 9 * 10 ** (digit - 1)).toString();
    }
}
