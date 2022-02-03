import { ContactField } from 'app/model/field/ContactField';
import { LoginIdField } from 'app/model/field/LoginId';
import { PasswordField } from 'app/model/field/PasswordField';
import { PhoneNumberField } from 'app/model/field/PhoneNumberField';
import { UserNameField } from 'app/model/field/UserNameField';
import { UserType } from 'app/model/field/UserType';
import { UserTypeField } from 'app/model/field/UserTypeField';
import { ValidatableField } from 'core/field/ValidatableField';
import { useState } from 'react';

export class User {
  static toFields(userObject) {
    return {
      id: userObject.id,
      loginId: new LoginIdField(userObject.loginId),
      password: new PasswordField(userObject.password),
      userName: new UserNameField(userObject.userName),
      phoneNumber: new PhoneNumberField(userObject.phoneNumber),
      contact: new ContactField(userObject.contact),
      userType:
        userObject.userType instanceof UserType
          ? new UserTypeField(userObject.userType.value)
          : new UserTypeField(userObject.userType),
    };
  }
  static toObject(userFields) {
    if (!userFields) {
      return userFields; // null or undefined
    }
    return {
      id: userFields.id,
      loginId: userFields.loginId.value,
      password: userFields.password.value,
      userName: userFields.userName.value,
      phoneNumber: userFields.phoneNumber.value,
      contact: userFields.contact.value,
      userType: UserType.valueOf(userFields.userType.value),
    };
  }
  static newEmptyObject() {
    return {
      id: -1,
      loginId: '',
      password: '',
      userName: '',
      phoneNumber: '',
      contact: '',
      userType: '',
    };
  }
  static emptyFieldsFactory() {
    return User.toFields(User.newEmptyObject());
  }
}

export function useUser(userObject) {
  const [user, setUser] = useState(() => User.toFields(userObject));
  const changetUser = (value, fieldName) => {
    user[fieldName].value = value;
    user[fieldName].validate();
    setUser({ ...user });
  };
  const resetUser = (savedUser) => {
    setUser(savedUser);
  };
  const validateAll = () => {
    if (ValidatableField.validateAll(user)) {
      return true;
    }
    setUser({ ...user });
    return false;
  };
  return [user, changetUser, resetUser, validateAll];
}
