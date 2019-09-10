# React NativeとCloud Visionで作るOCRアプリ
[こちら](https://qiita.com/ryo2132/items/80536b6ea4ed9f1e8a08) のQiitaで紹介したものです。

# Cloud Visionの設定

Cloud VisionのAPIキーが必要なため、以下参考にAPIキーを取得。
https://syncer.jp/cloud-vision-api

`config/enbiroment.ts` に記載してください。

```
$ mkdir config
$ touch ./config/environment.ts
```

```typescript: ./config/environment.ts
const Environment = {
  GOOGLE_CLOUD_VISION_API_KEY = "APIキー"
};

export default Environment;
```


# 起動

```
$ yarn
$ yarn start
```
