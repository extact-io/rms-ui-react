import { ConfigConsts } from 'app/ConfigConsts';

export class ErrorHandler {
  static #defualtErrorHandlers = {
    400: () => 'サーバーで予期しないエラーが発生しました(PARAMETER_ERROR)',
    401: () => '認証情報が無効になりました。ログインし直してください',
    500: () => 'サーバーで予期しないエラーが発生しました(INTERNAL_SERVER_ERROR)',
    503: () => 'サービス停止中です。サービス時間内もしくはしばらくしてからお試しください',
  };
  static #otherErrorHandler = () => 'サーバーで予期しないエラーが発生しました';

  getErrorHandlers(orverrideHandlers = {}) {
    const handlers = { ...ErrorHandler.#defualtErrorHandlers };
    Object.keys(orverrideHandlers).forEach((statusCode) => {
      handlers[statusCode] = orverrideHandlers[statusCode];
    });
    return handlers;
  }

  handleError(error, orverrideHandlers) {
    const errorHandlers = this.getErrorHandlers(orverrideHandlers);
    let targetHandler = errorHandlers[error.status];
    if (!targetHandler) {
      if (error.status) {
        // unknown status.
        targetHandler = ErrorHandler.#otherErrorHandler;
      } else {
        // exception occurred.
        console.log('exception occurred at ErrorHandler.handleError()', error);
        return { error: error, message: '予期しないエラーが発生しました' };
      }
    }
    return {
      error: error,
      code: this.mappingRmsErrorCode(error),
      message: targetHandler(error),
    };
  }

  mappingRmsErrorCode(error) {
    switch (error?.status) {
      case 401:
        return ConfigConsts.RMS_ERROR_CODE.AUTH_ERROR;
      default:
        return ConfigConsts.RMS_ERROR_CODE.OTHER_ERROR;
    }
  }
}
