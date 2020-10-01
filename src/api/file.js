const getFileMenu = [
  { 
    icon: 'photo',
    title: 'Images',
    to: { path: '/media', query: { type: 'image' }}
  },
  { 
    icon: 'videocam',
    title: 'Video',
    to: { path: '/media', query: { type: 'video' }}
  },
  { 
    icon: 'volume_down',
    title: 'Audio',
    to: { path: '/media', query: { type: 'audio' }}
  },
  { 
    icon: 'insert_drive_file',
    title: 'Document',
    to: { path: '/media', query: { type: 'doc' }}
  },

];
const Items =  [
  {
    '_id': 'a32c4aec-54de-4ff4-b165-8571ae805598',
    'fileName': '.DS_Store',
    'fileType': false,
    'path': 'static/.DS_Store',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/.DS_Store',
    'ext': '',
    'dir': 'static',
    'ctime': '2018-04-08T09:15:19.307Z',
    'size': 12292
  },
  {
    '_id': 'a30f71db-7dcf-4467-978f-e32841d47825',
    'fileName': '.gitkeep',
    'fileType': false,
    'path': 'static/.gitkeep',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/.gitkeep',
    'ext': '',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.010Z',
    'size': 0
  },
  {
    '_id': 'ca1bf511-a44e-4663-8b68-323419236ddf',
    'fileName': 'google.png',
    'fileType': 'image/png',
    'path': 'static/avatar/google.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/avatar/google.png',
    'ext': '.png',
    'dir': 'static/avatar',
    'ctime': '2018-04-08T08:31:07.808Z',
    'size': 12734
  },
  {
    '_id': '0693e01e-926c-4c95-818b-3f9b6d5413e7',
    'fileName': 'hangouts.png',
    'fileType': 'image/png',
    'path': 'static/avatar/hangouts.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/avatar/hangouts.png',
    'ext': '.png',
    'dir': 'static/avatar',
    'ctime': '2018-04-08T08:31:10.010Z',
    'size': 15266
  },
  {
    '_id': '53d3ba9d-90f2-4a60-af86-04679321f551',
    'fileName': 'inbox.png',
    'fileType': 'image/png',
    'path': 'static/avatar/inbox.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/avatar/inbox.png',
    'ext': '.png',
    'dir': 'static/avatar',
    'ctime': '2018-04-08T08:31:13.303Z',
    'size': 22444
  },
  {
    '_id': 'ef6397dd-ca99-459f-9694-bf9475359a51',
    'fileName': 'keep.png',
    'fileType': 'image/png',
    'path': 'static/avatar/keep.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/avatar/keep.png',
    'ext': '.png',
    'dir': 'static/avatar',
    'ctime': '2018-04-08T08:31:15.534Z',
    'size': 2146
  },
  {
    '_id': 'e6dcaede-1c87-4052-a4e9-f894809d5984',
    'fileName': 'messenger.png',
    'fileType': 'image/png',
    'path': 'static/avatar/messenger.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/avatar/messenger.png',
    'ext': '.png',
    'dir': 'static/avatar',
    'ctime': '2018-04-08T08:31:24.183Z',
    'size': 7006
  },
  {
    '_id': '78a63d97-c763-4fa4-883f-8f9ed4425a6a',
    'fileName': '1.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/1.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/1.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.070Z',
    'size': 275608
  },
  {
    '_id': '29245130-ec05-4bf1-90ea-06574faa9bda',
    'fileName': '10.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/10.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/10.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.096Z',
    'size': 283680
  },
  {
    '_id': '83c2cfc6-80c2-4bc0-af02-4b2e6a94a2d3',
    'fileName': '11.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/11.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/11.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.100Z',
    'size': 99467
  },
  {
    '_id': '71fa31b2-4463-4c4c-baf2-719cd89ab15a',
    'fileName': '12.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/12.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/12.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.103Z',
    'size': 82253
  },
  {
    '_id': '74db5dd4-f60d-415a-b6f7-3107ce2e5cda',
    'fileName': '13.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/13.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/13.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:41:46.865Z',
    'size': 103275
  },
  {
    '_id': '54dc3e30-a9c8-4a68-9f9b-b070f5a5fea4',
    'fileName': '14.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/14.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/14.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.111Z',
    'size': 103446
  },
  {
    '_id': 'c2c9104b-8a26-4bce-b942-7104e57687b7',
    'fileName': '15.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/15.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/15.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.119Z',
    'size': 105339
  },
  {
    '_id': '6b608ce9-e35b-4dfb-87cb-f4ca19102996',
    'fileName': '16.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/16.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/16.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.122Z',
    'size': 88580
  },
  {
    '_id': 'a9b26177-5927-44a5-8b7c-4cad8425e9a5',
    'fileName': '17.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/17.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/17.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.125Z',
    'size': 98465
  },
  {
    '_id': 'f1168479-113a-4f8a-a014-45ff6351941e',
    'fileName': '18.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/18.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/18.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.128Z',
    'size': 100565
  },
  {
    '_id': 'd1cd7b81-b301-425f-89d1-e0cbf2f7a0cb',
    'fileName': '19.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/19.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/19.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.138Z',
    'size': 39500
  },
  {
    '_id': 'c9ebff9b-651a-43c8-8e8a-028bb69b00ef',
    'fileName': '2.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/2.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/2.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.075Z',
    'size': 268438
  },
  {
    '_id': 'fa673c64-e747-4279-8574-be153c106ede',
    'fileName': '20.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/20.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/20.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.143Z',
    'size': 104204
  },
  {
    '_id': '74e2ab71-4261-4fa9-b2e7-4844ef9f1d58',
    'fileName': '21.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/21.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/21.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:41:54.525Z',
    'size': 91890
  },
  {
    '_id': '5fb2fed2-fc86-4bd5-9144-7d36b3dacd60',
    'fileName': '22.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/22.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/22.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.150Z',
    'size': 104620
  },
  {
    '_id': '8d6cdfc5-e69a-44d2-b6e3-4265b4b87cc1',
    'fileName': '23.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/23.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/23.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.157Z',
    'size': 103130
  },
  {
    '_id': 'd733c863-b5ed-46b2-9eb2-42eb9fa285fa',
    'fileName': '24.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/24.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/24.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.159Z',
    'size': 105835
  },
  {
    '_id': 'f9c7064e-2542-473f-9b4d-98d122ef4364',
    'fileName': '25.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/25.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/25.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.162Z',
    'size': 95075
  },
  {
    '_id': 'e2ea7604-a86d-4fef-bb20-40fae6bb7ce0',
    'fileName': '26.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/26.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/26.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.166Z',
    'size': 104342
  },
  {
    '_id': 'f7570a47-938c-4e9c-aba6-a82f30b7bef5',
    'fileName': '27.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/27.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/27.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.168Z',
    'size': 90063
  },
  {
    '_id': '4dc41162-89b5-499b-b702-cf951a04841e',
    'fileName': '28.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/28.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/28.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.171Z',
    'size': 132461
  },
  {
    '_id': 'ed316744-39c6-4de3-a346-4436d080291a',
    'fileName': '29.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/29.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/29.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.173Z',
    'size': 121466
  },
  {
    '_id': 'af9acc25-694a-4656-a790-584129b21cc4',
    'fileName': '3.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/3.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/3.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.077Z',
    'size': 308780
  },
  {
    '_id': 'c2be3695-f084-4a41-bc0b-79062e4eefe0',
    'fileName': '30.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/30.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/30.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.176Z',
    'size': 125198
  },
  {
    '_id': '708a5185-2de7-4477-ac84-d99f434fa7cc',
    'fileName': '31.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/31.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/31.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.179Z',
    'size': 292495
  },
  {
    '_id': 'c9782516-bd3d-4ca6-9397-91b806d4d5aa',
    'fileName': '32.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/32.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/32.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.186Z',
    'size': 278854
  },
  {
    '_id': '00ac4093-8202-408e-8b88-a33313d39e6b',
    'fileName': '33.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/33.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/33.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.196Z',
    'size': 296287
  },
  {
    '_id': '9d3ed291-8706-4d1c-b37a-9da33f808622',
    'fileName': '34.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/34.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/34.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.199Z',
    'size': 298335
  },
  {
    '_id': '38cfc863-13f1-4ab6-acd1-2f403b77f539',
    'fileName': '35.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/35.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/35.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.204Z',
    'size': 285123
  },
  {
    '_id': '1cbde33c-6ef6-45e6-930a-94bfae6a4b4d',
    'fileName': '36.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/36.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/36.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.207Z',
    'size': 294032
  },
  {
    '_id': 'c4835081-6414-4e23-ae05-6b23997a4f6f',
    'fileName': '37.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/37.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/37.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.210Z',
    'size': 261250
  },
  {
    '_id': '16647278-2e36-4285-8347-7aeab0fbf468',
    'fileName': '38.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/38.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/38.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.214Z',
    'size': 292620
  },
  {
    '_id': 'e8047c06-fca2-4405-8823-d5497c788362',
    'fileName': '39.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/39.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/39.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.217Z',
    'size': 290569
  },
  {
    '_id': 'd69f047b-8ebf-4d3d-b436-09bbbf6cba4b',
    'fileName': '4.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/4.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/4.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.080Z',
    'size': 287013
  },
  {
    '_id': 'ad16609e-154b-401d-835f-bbcb6f4a496b',
    'fileName': '40.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/40.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/40.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.219Z',
    'size': 297662
  },
  {
    '_id': '8c4cf24d-de27-4aea-abca-f38865cc9239',
    'fileName': '5.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/5.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/5.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.083Z',
    'size': 318957
  },
  {
    '_id': '88a031a1-323d-4ca6-9115-61762dbdffe9',
    'fileName': '6.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/6.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/6.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:41:50.063Z',
    'size': 287785
  },
  {
    '_id': '5e42c142-b511-4a11-bdaf-ae85ac8417c6',
    'fileName': '7.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/7.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/7.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.089Z',
    'size': 285392
  },
  {
    '_id': '5194e91c-5975-40a4-9353-83055b0c8cbb',
    'fileName': '8.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/8.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/8.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.091Z',
    'size': 272918
  },
  {
    '_id': 'c5f859ed-012c-48d3-a037-bf164f8b0c84',
    'fileName': '9.jpg',
    'fileType': 'image/jpeg',
    'path': 'static/bg/9.jpg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/bg/9.jpg',
    'ext': '.jpg',
    'dir': 'static/bg',
    'ctime': '2018-03-30T08:40:27.094Z',
    'size': 285242
  },
  {
    '_id': 'b83f94eb-3fa4-474f-8b09-91ec5b9e67da',
    'fileName': '403.svg',
    'fileType': 'image/svg+xml',
    'path': 'static/error/403.svg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/error/403.svg',
    'ext': '.svg',
    'dir': 'static/error',
    'ctime': '2018-03-30T06:10:45.825Z',
    'size': 55336
  },
  {
    '_id': '7b93354a-fc3c-45ae-890a-8bcb5c294f55',
    'fileName': '404.svg',
    'fileType': 'image/svg+xml',
    'path': 'static/error/404.svg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/error/404.svg',
    'ext': '.svg',
    'dir': 'static/error',
    'ctime': '2018-03-30T06:10:45.814Z',
    'size': 88876
  },
  {
    '_id': 'd2b741d4-206d-4be5-819d-3a00fd6895f0',
    'fileName': '500.svg',
    'fileType': 'image/svg+xml',
    'path': 'static/error/500.svg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/error/500.svg',
    'ext': '.svg',
    'dir': 'static/error',
    'ctime': '2018-03-30T06:10:45.818Z',
    'size': 88720
  },
  {
    '_id': 'cf1cd0df-861e-4216-beba-c5fa266081dd',
    'fileName': 'google.svg',
    'fileType': 'image/svg+xml',
    'path': 'static/google.svg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/google.svg',
    'ext': '.svg',
    'dir': 'static',
    'ctime': '2018-03-30T06:10:12.693Z',
    'size': 1574
  },
  {
    '_id': 'd145ac45-57b4-4754-a058-79bf42bb2963',
    'fileName': 'manifest.json',
    'fileType': 'application/json',
    'path': 'static/manifest.json',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/manifest.json',
    'ext': '.json',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.018Z',
    'size': 303
  },
  {
    '_id': '8b2ca729-a2eb-4950-855d-1dd3ce831765',
    'fileName': 'robots.txt',
    'fileType': 'text/plain',
    'path': 'static/robots.txt',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/robots.txt',
    'ext': '.txt',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.021Z',
    'size': 23
  },
  {
    '_id': 'e5a6e6f5-a9c8-49be-b2e2-c5074f4fa6c2',
    'fileName': 'sitemap.xml',
    'fileType': 'application/xml',
    'path': 'static/sitemap.xml',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/sitemap.xml',
    'ext': '.xml',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.019Z',
    'size': 15488
  },
  {
    '_id': '7cf65477-4aad-45de-924c-a38ded2471ef',
    'fileName': 'v.png',
    'fileType': 'image/png',
    'path': 'static/v.png',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/v.png',
    'ext': '.png',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.023Z',
    'size': 5674
  },
  {
    '_id': '5d333a3d-9140-4b8c-9ae3-9a8a96f0309e',
    'fileName': 'v.svg',
    'fileType': 'image/svg+xml',
    'path': 'static/v.svg',
    'fullPath': '/Users/michael/themeforest/vue-material-admin/static/v.svg',
    'ext': '.svg',
    'dir': 'static',
    'ctime': '2018-03-14T09:21:32.017Z',
    'size': 538
  }
];

const getFile = (limit) => {
  return (limit) ? Items.slice(0, limit) : Items;
};

export {
  getFileMenu,
  getFile
};