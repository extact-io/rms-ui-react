# RMS for React UI
> RMS for React UIはReactとMaterial-UIの利用法や効果を確認することを目的とした[Rental Management System](https://github.com/extact-io/rms)のSPAアプリです

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [アーキテクチャ](#%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3)
- [ビルドと動作方法](#%E3%83%93%E3%83%AB%E3%83%89%E3%81%A8%E5%8B%95%E4%BD%9C%E6%96%B9%E6%B3%95)
- [`rms-ui-react`で実装している仕組みの紹介](#rms-ui-react%E3%81%A7%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E4%BB%95%E7%B5%84%E3%81%BF%E3%81%AE%E7%B4%B9%E4%BB%8B)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## アーキテクチャ
Next.jsなど混じり気のないReact純度100%のJavaScriptによるSPAアプリです

### 利用ライブラリ
 - [React.js](https://reactjs.org/) 17.0
 - [Material-UI(MUI)](https://mui.com/) 4.12
 - [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) 5.4

State管理に外部ライブラリは利用せずReact純正の`useState`, `useReducer`, `useContext`の3つで行っています  
その他の仕組みは[react-uiで実装している仕組み](#rms-ui-reactで実装している仕組みの紹介)に記載

## ビルドと動作方法

### フロントエンドのビルドと起動
Reactと言えば`yarn` なので例に`yarn`を使っていますが`npm`でも問題ありません（やったことないけど多分大丈夫なハズ）

OpenAPI Generatorで自動生成したClient APIは[rms-generated-client-js](https://github.com/extact-io/rms-generated-client-js)として別パッケージにしています。  ホントであれば`yarn install`で他のdependencyと一緒にインストールしたいところですが、誰でも簡単にダウンロードできる適当なPackage Registryがないので、`npm link` で依存を解決しています  

1. rms-ui-reactのインストール  
``` shell
# Clone this repository
git clone https://github.com/extact-io/rms-ui-react.git
# Go into the repository
cd rms-ui-react
# Install dependencies
yarn install
```

2. rms-generated-client-jsのインストール  
``` shell
# Clone this repository
git clone https://github.com/extact-io/rms-generated-client-js.git
# Go into the repository
cd rms-generated-client-js
# link to global
npm install
npm link
# Go into the rms-ui-react directory
cd /path/to/your/rms-ui-react_dir
# link to node_modules
npm link @extact-io/rms-generated-client-js
```

3. rms-ui-reactの起動  
``` shell
# Go into the rms-ui-react directory
cd /path/to/your/rms-ui-react_dir
# Run the app
yarn start
```
`yarn start`で自動でブラウザが立ち上がりLogin画面がでれば手順は成功です（ブラウザが立ち上がってからLogin画面がでるまで1,2分掛かります）  
ただし、rms-ui-reactはフロントエンドアプリなのでLogin画面以降の動作にはバックエンドのサーバーアプリが必要です。サーバアプリには実物の[RMS](https://github.com/extact-io/rms)を使います。動作させる場合の次の手順を行ってください

### バックエンドアプリのビルドと起動
Javaアプリのためビルドと起動にはJava11以上とMavenが必要となります。この2つはインストールされている前提で手順を説明します

1. dependencyのローカルインストールとビルド  
``` shell
# Clone this repository
git clone https://github.com/extact-io/rms.git
# Go into the repository
cd rms
# Install dependencies
mvn -Pcli,all clean install -DskipTests=true
# Go into the app directory
cd rms-server
# Build the app
mvn -Pcli,copy-libs clean package -DskipTests=true
```

2. バックエンドアプリの起動
``` shell
# Run the app
java -Drms.h2.script=classpath:init-rms-demo.ddl -jar -Ddebug.sleep.enable=true -Ddebug.sleep.time=300 target/rms-server.jar
```

stacktraceが出力されていなければ起動は成功です。[こちら](https://github.com/extact-io/rms#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%A7%E7%94%A8%E6%84%8F%E3%81%97%E3%81%A6%E3%81%84%E3%82%8Bidpassword)に記載のID/paasswordでログインできます。なお、UIのProgressやBackdropの動作を確認するため、起動パラメータでsleepを入れていますが、これの指定はなくても問題はありません


## `rms-ui-react`で実装している仕組みの紹介
### ウィザード遷移と単発遷移の2つの遷移パターン
業務アプリの多くは、一般のユーザが利用する「表」の画面と管理者が利用する「裏」の画面に分かれ、また双方で画面の遷移パターンが異なる場合が多いです

rms-ui-reactはこの考慮として「表」の会員機能はウィザード遷移（レンタル品予約）、「裏」の管理機能はダイアログでCRUDを行う2つの遷移パターンで実装しています

- 会員機能(ウィザード遷移)
  - [キャプチャ動画で見てみる](/docs/screen_video_member.md)
- 管理機能(単発遷移＋ダイアログ)
  - [キャプチャ動画で見てみる](/docs/screen_video_admin.md)

### マスタメンテナンス画面の共通化
マスタメンテナンス画面の多くは扱うマスタが異なるだけで行う操作（処理）は同じになることが多くあります。またこれらをマスタごとに別々に実装すると冗長な実装となります

rms-ui-reactではマスタのCRUD処理や描画処理を共通化したコンポーネントを作成し、個々のマスタメンテナンス画面は差分の実装やパラメータ定義だけすればよくしています

- 実装の説明
  | レイヤ | 機能 | 実装 | 説明 |
  |-----|-----|------|------|
  | core| 共通 | [MasterMainteDataGrid.js](/src/core/mastermainte/MasterMainteDataGrid.js) | `MasterContext`定義に従い動作する |
  | app | レンタル品 | [RentalItemMasterContext.js](/src/app/ui/panel/admin/RentalItemMasterContext.js) | 表示カラムの定義や`CRUD API`などを定義 |
  |  | 予約 |  [ReservationMasterContext.js](/src/app/ui/panel/admin/ReservationMasterContext.js)|同上|
  |  | ユーザ | [UserMasterContext.js](/src/app/ui/panel/admin/UserMasterContext.js) |同上|

### 入力と表示コンポーネントの一体化
マスタメンテナス画面は1項目に対し参照画面では表示項目出力、登録/更新画面では入力項目出力と言ったように出力形式の分岐が必要となります。これに対するよくある実装としては、項目ごとに分岐するか、または参照画面、更新画面と画面レベルで実装を分ける方法がありますが、いずれも実装が冗長となります

rms-ui-reactではモードにより入力（input）と表示(label)を切り替えることができる項目コンポーネント(`EditablTextField`)を作成し入力画面と参照画面を分岐なく1つで実装できるようにしています

- [EditablTextField](/src/core/component/EditableTextField.js)を使った実装例  
``` javascript
<PanelLayout>
  <Box mb={3}>
    <Typography component="h1" variant="h4" align="center">ユーザプロファイル</Typography>
  </Box>
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <EditableTextField id="loginId" label="ログインID" editable={false} 
        value={targetUser.loginId.value} 
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <EditableTextField id="password" label="パスワード" type="password" editable={edit} 
        fieldValue={targetUser.password} onChange={handleChangeTargeUser}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <EditableTextField id="userName" label="ユーザ名" editable={edit} 
        fieldValue={targetUser.userName} onChange={handleChangeTargeUser}
      />
    </Grid>
    ... snip
  </Grid>
<PanelLayout>
```
（参考）UserProfileの参照/登録/更新を行う`UserProfilePanel`の実装は[こちら](/src/app/ui/panel/common/UserProfilePanel.js)。`editable`属性により出力形式が切り替わるようにしています。


### チェックルールの一元化
入力チェックを画面ごとに実装すると重要なドメインルールの１つであるチェック実装が各画面に散ってしまいます

rms-ui-reactではDOA(DataOrientedApproach)で言う"ドメイン"ごとにフィールドクラスを作成し、画面の入力チェックはフィールドインスタンスですべて行っています。これによりA項目の入力がX画面とY画面に現れた場合でもそのチェック実装はAフィールドクラスに局所化されます。またフィールドクラスには「半角数値のみ」といった画面や処理に依らない普遍的なドメインの情報も一緒に定義可能にしています

- フィールドクラスの1例（[PasswordField](/src/app/model/field/PasswordField.js))を使った実装例
```javascript
class PasswordFieldValidator extends FieldValidator {
  static INSTANCE = new PasswordFieldValidator();
  static #PATTERN = new RegExp(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/);
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length <= 5) {
      return '文字数不足(5文字以上)';
    }
    if (value.length > 10) {
      return '文字数オーバー(10文字以内)';
    }
    if (!PasswordFieldValidator.#PATTERN.test(value)) {
      return '半角英数記号以外の使用不可';
    }
    return null;
  }
}

export class PasswordField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '半角5文字以上10文字以下') {
    super(value, PasswordFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
```
UserProfile画面とユーザメンテナンスダイアログの双方にパスワードの入力がありますがどちらもPasswordFieldに実装されています。また、これは他のすべてのフィールドについても同様ですべてのフィールドは[fieldディレクトリ](/src/app/model/field/)に実装されています

### 終了日時の自動補完
Googleカレンダーのように開始日を次の日にしたら終了日を自動でズラすCustomHook(`useFromToDateTime`)を作成しています（Pickerからの入力だけであればそれほど実装は難しくないですが、今回は手入力も可としているので手入力された場合の不正に日付のバリデーションも考慮する必要があるため実装にかなり苦労しました...）

- [useFromToDateTime](/src/app/ui/panel/member/useFromToDateTime.js)を使った例
```javascript
const fromToDateTime = useFromToDateTime();
return (
  <FtdKeyboardDatePicker id="startDate" label="開始日" 
    fromToDateTime={fromToDateTime} ...
    ...
  />
  <FtdKeyboardDatePicker id="endDate" label="終了日" minDate={fromToDateTime.startDate.value}
    fromToDateTime={fromToDateTime}
    ...
  />
```
上の実装はレンタル品を検索する`RentalItemListPanel`の実装の一部となります。開始日, 開始時刻, 終了日, 終了時刻の4つのフィールドは`useFromToDateTime`フックで管理され複雑な相関チェックやエラーメッセージなど開始終了日時に関するすべてのことがフックに隠蔽されています。

利用者側はこれら複雑なことを気にする必要はありません。また、この開始終了日時のドメインルールはレンタル品予約など他の画面で必要となりますが、いずれも`useFromToDateTime`フックで実現されています

### `OpenAPI Generator`を利用したClientコードの自動生成
バックエンドのAPI呼び出しはバックエンド側が公開しているOAS(openapi.yml)を入力しとして[`OpenAPI Generator`](https://openapi-generator.tech/)で自動生成したものを利用しています。また、自動生成されたコードに対する追加や置き換えはすべて`ApiClientFactory`で行い、再生成に対する考慮をしています

- [ApiClientFactory](/src/app/model/api/ApiClientFactory.js)の実装の一部
```javascript
class ApiClientFactory {
  // constructor
  constructor(baseUrl = process.env.REACT_APP_API_ENDPOINT) {
    this.apiClient = new ApiClient(baseUrl);
    this.apiClient.authentications = this.authTypeDef;
    this.errorHandler = new ErrorHandler();
  }
  // methods
  getAuthenticateApiFacade() {
    if (!this.authenticateApiFacade) {
      this.authenticateApiFacade = new AuthenticateApiFacade(
        new AuthenticateApi(this.apiClient),
        this.errorHandler
      );
    }
    return this.authenticateApiFacade;
  }
  ... snip
}

// replace ApiClient method.
ApiClient.parseDate = DateUtils.parseDateFromJsonFormat;
UserType.constructFromObject = (userType) => {
  if (userType instanceof ModelUserType) {
    return userType.value;
  }
  return userType; // String
};
ApiClientFactory.instance = new ApiClientFactory();
export { ApiClientFactory };

```

- `ApiClientFactory`の利用コード例([Login](/src/app/ui/login/Login.js)での利用)
```javascript
const authApiFacade = ApiClientFactory.instance.getAuthenticateApiFacade();
const result = await authApiFacade.authenticate(loginId, password);
```
バックエンドの変更がアプリケーションの広範に及ばないようにするため、自動生成されたAPIを直接利用するのではなく、すべて`facade`を経由させるようにしています。`facade`インスタンスは`ApiClientFactory`から取得することで、APIに対する追加や差分が常に織り込まれたインスタンスが使われるようにしています

