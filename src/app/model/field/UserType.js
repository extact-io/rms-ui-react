export class UserType {
  static USER_TYPES = {
    MEMBER: new UserType('MEMBER', '会員'),
    ADMIN: new UserType('ADMIN', '管理者'),
  };
  constructor(value, label) {
    this.value = value;
    this.label = label;
  }
  isAdmin() {
    return UserType.isAdmin(this);
  }
  isMember() {
    return UserType.isMember(this);
  }
  toLabelValue() {
    return { value: this.value, label: this.label };
  }
  static getOptions(containsUnSelect = false) {
    const options = Object.values(UserType.USER_TYPES).map((v) => v.toLabelValue());
    return containsUnSelect ? [{ value: '', label: '未選択' }, ...options] : options;
  }
  static valueOf(value) {
    if (!UserType.USER_TYPES[value]) {
      return null; // 該当なし
    }
    return UserType.USER_TYPES[value];
  }
  static isAdmin(userType) {
    return userType.value === UserType.USER_TYPES.ADMIN.value;
  }
  static isMember(userType) {
    return !this.isAdmin(userType);
  }
}
