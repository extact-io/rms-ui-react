import { BearerToken } from 'app/model/BearerToken';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { UserType } from 'app/model/field/UserType';
import React, { createContext, useState } from 'react';

export const SessionContext = createContext();

export default function SessionContextProvider({ children }) {
  const [sessionContext, setSessionContext] = useState({
    loginUser: null,
  });
  const loginUser = sessionContext.loginUser;
  const updateLoginUser = (user) =>
    setSessionContext({
      loginUser: user,
    });
  const logout = () => {
    const token = BearerToken.getInstance();
    if (token) {
      token.remove();
    }
    setSessionContext({
      loginUser: null,
    });
  };
  const authenticated = () => {
    return !!sessionContext.loginUser;
  };
  const fallbackAuth = async () => {
    // jwtもなければ未認証
    // const { id } = BearerToken.getInstance();
    // if (!id) {
    //   return false;
    // }
    const token = BearerToken.getInstance();
    if (!token) {
      return false;
    }

    // jwtの情報をもとにServerからユーザ情報をfetchして取得
    const commonApiFacade = ApiClientFactory.instance.getCommonApiFacade();
    let loginUser = null;
    try {
      loginUser = await commonApiFacade.getOwnUserProfile();
    } catch (error) {
      console.log(error.status, error.message);
      return null;
    }

    // 復元したユーザ情報をセッションへ格納
    updateLoginUser(loginUser);

    // 遷移先の決定
    switch (loginUser.userType.value) {
      case UserType.USER_TYPES.MEMBER.value:
        return '/member';
      case UserType.USER_TYPES.ADMIN.value:
        return '/admin';
      default:
        throw new Error('Unknown userType=' + loginUser.userType);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        loginUser,
        updateLoginUser,
        logout,
        authenticated,
        fallbackAuth,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
