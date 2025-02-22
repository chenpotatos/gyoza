---
title: 初探flutter开发i18n，多主题适配，响应式
date: 2024-06-12T14:32:21.865Z
tags: [flutter]
comments: true
draft: true
---

最近开发一个应用，遇到一下三个难题，这三个都是很基础的需求，但目前是我最大的拦路虎。

## 国际化

这里是通过安装插件实现的国际化方案：

```
 Android Studio -> File -> Setting -> Plugins -> 搜索Flutter Intl

 Flutter Intl
 1.18.4-2022.2
 2024.06.13
```

安装依赖

注：一开始添加依赖的时候，没有这样设置，会导致报错

```yaml
dev_dependencies:
 ...
  flutter_localizations:
    sdk: flutter
```

```bash
flutter pub get
```

初始化项目

```
Tool->Flutter Intl ->Initalize for the project：
```

成功后需要在`pubspec.yaml`后添加

```yaml
flutter:
  ...
  generate: true
  ...

# 放在最后
flutter_intl:
  enabled: true
```

![图片示意图](https://qi.7miaoyu.com/myblog/blog/2024/06/13/091514.png)

- generated包下的intl目录默认生成 **messages_all.dart** 和 **messages_en.dart** 文件，自动生成前缀是messages的文件。

还需要再arb文件中添加如下的内容

```
{
  "@@locale": "zh", // 这是需要添加，en文件中也类似
  "title": "你好，世界",
  "message": "这是一条本地化信息。",
  "setting": "设置"
}
```

如果需要添加新的语言语言包

```
Tool->Flutter Intl -> Add Locale：
```

MaterialApp 配置如下：

```dart
import 'package:flutter_localizations/flutter_localizations.dart';
import './generated/l10n.dart';

MaterialApp(
      ...
      localizationsDelegates: [
        S.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: S.delegate.supportedLocales,
      ...
    )
```

最后使用：

```dart
class LocalizationDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('${S.of(context).title}'),
      ),
    );
  }
}
```

## 多主题

## 响应式

可以采用第三包的方案，例如：`responsive_builder`根据页面的大小，展示相应适配后的组件。该app可能会涉及到手机，平板，电脑。三种设备的宽度、高度，差异巨大，不一定会一个组件贯彻到底，所以采用该第三方库比较适合。

也可以使用原生方案，对于基础的页面，只需要根据页面的宽度来适配。

方法如下:

**MediaQuery**

```dart
import 'package:flutter/material.dart';

var screenWidth = MediaQuery.of(context).size.width; // 获取当前设备页面宽度
var screenHeight = MediaQuery.of(context).size.height; // 获取当前设备的长度
```

**LayoutBuilder**

`LayoutBuilder` 可以根据父组件的约束条件来构建不同的布局。

```dart
import 'package:flutter/material.dart';

class ResponsiveLayoutBuilderWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Responsive Layout Builder Widget'),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 600) {
            return Center(child: Text('Small Screen'));
          } else {
            return Center(child: Text('Large Screen'));
          }
        },
      ),
    );
  }
}
```

**Flex 和 Expanded**

通过使用 `Flex` 和 `Expanded` 小部件，可以创建自适应的布局，确保子组件在不同尺寸的屏幕上都能合理分布。

```dart
import 'package:flutter/material.dart';

class FlexResponsiveWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flex Responsive Widget'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 1,
            child: Container(color: Colors.red),
          ),
          Expanded(
            flex: 2,
            child: Container(color: Colors.green),
          ),
          Expanded(
            flex: 1,
            child: Container(color: Colors.blue),
          ),
        ],
      ),
    );
  }
}
```

**FittedBox 和 AspectRatio**

`FittedBox` 可以根据父组件的大小来调整子组件的尺寸和位置，而 `AspectRatio` 则可以用来保持宽高比。

```dart
import 'package:flutter/material.dart';

class AspectRatioResponsiveWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Aspect Ratio Responsive Widget'),
      ),
      body: Center(
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: Container(
            color: Colors.blue,
            child: FittedBox(
              fit: BoxFit.contain,
              child: Text('Aspect Ratio 16:9'),
            ),
          ),
        ),
      ),
    );
  }
}
```

## ThemeData

```dart
factory ThemeData({
  Brightness brightness, // 应用整体主题的亮度。用于按钮之类的小部件，以确定在不使用主色或强调色时选择什么颜色。
  MaterialColor primarySwatch,// 定义一个单一的颜色以及十个色度的色块。
  Color primaryColor, // 应用程序主要部分的背景颜色(toolbars、tab bars 等)
  Brightness primaryColorBrightness, // primaryColor的亮度。用于确定文本的颜色和放置在主颜色之上的图标(例如工具栏文本)。
  Color primaryColorLight, // primaryColor的浅色版
  Color primaryColorDark, // primaryColor的深色版
  Color accentColor, // 小部件的前景色(旋钮、文本、覆盖边缘效果等)。
  Brightness accentColorBrightness, // accentColor的亮度。
  Color canvasColor, //  MaterialType.canvas 的默认颜色
  Color scaffoldBackgroundColor, // Scaffold的默认颜色。典型Material应用程序或应用程序内页面的背景颜色。
  Color bottomAppBarColor, // BottomAppBar的默认颜色
  Color cardColor, // Card的颜色
  Color dividerColor, // Divider和PopupMenuDivider的颜色，也用于ListTile之间、DataTable的行之间等。
  Color highlightColor, // 选中在泼墨动画期间使用的突出显示颜色，或用于指示菜单中的项。
  Color splashColor,  // 墨水飞溅的颜色。InkWell
  InteractiveInkFeatureFactory splashFactory, // 定义由InkWell和InkResponse反应产生的墨溅的外观。
  Color selectedRowColor, // 用于突出显示选定行的颜色。
  Color unselectedWidgetColor, // 用于处于非活动(但已启用)状态的小部件的颜色。例如，未选中的复选框。通常与accentColor形成对比。也看到disabledColor。
  Color disabledColor, // 禁用状态下部件的颜色，无论其当前状态如何。例如，一个禁用的复选框(可以选中或未选中)。
  Color buttonColor, // RaisedButton按钮中使用的Material 的默认填充颜色。
  ButtonThemeData buttonTheme, // 定义按钮部件的默认配置，如RaisedButton和FlatButton。
  Color secondaryHeaderColor, // 选定行时PaginatedDataTable标题的颜色。
  Color textSelectionColor, // 文本框中文本选择的颜色，如TextField
  Color cursorColor, // 文本框中光标的颜色，如TextField
  Color textSelectionHandleColor,  // 用于调整当前选定的文本部分的句柄的颜色。
  Color backgroundColor, // 与主色形成对比的颜色，例如用作进度条的剩余部分。
  Color dialogBackgroundColor, // Dialog 元素的背景颜色
  Color indicatorColor, // 选项卡中选定的选项卡指示器的颜色。
  Color hintColor, // 用于提示文本或占位符文本的颜色，例如在TextField中。
  Color errorColor, // 用于输入验证错误的颜色，例如在TextField中
  Color toggleableActiveColor, // 用于突出显示Switch、Radio和Checkbox等可切换小部件的活动状态的颜色。
  String fontFamily, // 文本字体
  TextTheme textTheme, // 文本的颜色与卡片和画布的颜色形成对比。
  TextTheme primaryTextTheme, // 与primaryColor形成对比的文本主题
  TextTheme accentTextTheme, // 与accentColor形成对比的文本主题。
  InputDecorationTheme inputDecorationTheme, // 基于这个主题的 InputDecorator、TextField和TextFormField的默认InputDecoration值。
  IconThemeData iconTheme, // 与卡片和画布颜色形成对比的图标主题
  IconThemeData primaryIconTheme, // 与primaryColor形成对比的图标主题
  IconThemeData accentIconTheme, // 与accentColor形成对比的图标主题。
  SliderThemeData sliderTheme,  // 用于呈现Slider的颜色和形状
  TabBarTheme tabBarTheme, // 用于自定义选项卡栏指示器的大小、形状和颜色的主题。
  CardTheme cardTheme, // Card的颜色和样式
  ChipThemeData chipTheme, // Chip的颜色和样式
  TargetPlatform platform,
  MaterialTapTargetSize materialTapTargetSize, // 配置某些Material部件的命中测试大小
  PageTransitionsTheme pageTransitionsTheme,
  AppBarTheme appBarTheme, // 用于自定义Appbar的颜色、高度、亮度、iconTheme和textTheme的主题。
  BottomAppBarTheme bottomAppBarTheme, // 自定义BottomAppBar的形状、高度和颜色的主题。
  ColorScheme colorScheme, // 拥有13种颜色，可用于配置大多数组件的颜色。
  DialogTheme dialogTheme, // 自定义Dialog的主题形状
  Typography typography, // 用于配置TextTheme、primaryTextTheme和accentTextTheme的颜色和几何TextTheme值。
  CupertinoThemeData cupertinoOverrideTheme
})
```

### Flutter 弹出输入框导致溢出

```dart
return Scaffold(
      resizeToAvoidBottomInset: false,
)

```

resizeToAvoidBottomInset：如果为true，则[body]和脚手架的浮动窗口小部件应自行调整大小，以避免屏幕键盘的高度由周围的[MediaQuery]的[MediaQueryData.viewInsets] bottom属性定义。例如，如果在支架上方显示了屏幕键盘，则可以调整主体的大小以避免键盘重叠，这可以防止键盘遮盖主体内部的小部件。默认为true。

```dart
import 'dart:async';


import 'package:flutter/material.dart';

import 'package:flutter_application_demo04/res/global/global.dart';

import 'package:flutter_application_demo04/res/util/hexColor.dart';

import 'package:flutter_application_demo04/res/widgets/load_image.dart';

import 'package:flutter_easyloading/flutter_easyloading.dart';

import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';

import 'package:image_picker/image_picker.dart';

import 'package:scan/scan.dart';


import '../../../../res/net/dio_api.dart';

import '../../../../res/net/service_repository.dart';

import 'my_manager_team.dart';


/// page--自定义二维码扫描页

class ScanPage extends StatelessWidget {

// 是否为重新绑定

  final bool? isFromReset;


  final bool? isPlus;

// final ImagePicker picker = ImagePicker();

  IconData lightIcon = Icons.flash_on;

  final ScanController _controller = ScanController();


  ScanPage({super.key, this.isFromReset, this.isPlus});


  void getResult(String result, BuildContext context) {
	//TODO

    if (result.contains('conditions...')) {
	// 上送扫描结果到服务端

	//_bindGroup(code: result ?? '', isReset: isFromReset);

    } else {
	// 扫码错误

      EasyLoading.showToast('无效的二维码');

      Future.delayed(

          const Duration(

            seconds: 2,

          ), () {
	// 重新激活相机

        _controller.resume();
      });
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(

      body: Stack(children: [

        ScanView(

          controller: _controller,

          scanLineColor: HexColor('#13C2C2'),

          onCapture: (data) {
            _controller.pause();

            getResult(data, context);
          },

        ),

        Positioned(

            top: 0,

            left: 0,

            right: 0,

            child: SizedBox(

              height: 120,

              child: Padding(

                padding: const EdgeInsets.only(left: 10, right: 10),

                child: Row(

                  mainAxisAlignment: MainAxisAlignment.spaceBetween,

                  children: [

                    GestureDetector(

                      onTap: () {
                        Get.back();
                      },

                      child: const SizedBox(

                        height: 30,

                        width: 30,

                        child: LoadAssetImage(

                          'nav_back_white',

                          fit: BoxFit.cover,

                        ),

                      ),

                    ),

                    const Text(

                      '扫一扫',

                      style: TextStyle(

                          fontSize: 18,

                          color: Colors.white,

                          fontWeight: FontWeight.w600),

                    ),

                    GestureDetector(

                      onTap: () {
						// 相册
						// 请求授权

                        Global.requestPermission(

                            isCamera: false,

                            callBack: () {
                              _getImage();
                            });
                      },

                      child: const SizedBox(

                        height: 30,

                        width: 30,

                        child: LoadAssetImage(

                          'scaner_album',

                          fit: BoxFit.cover,

                        ),

                      ),

                    ),

                  ],

                ),

              ),

            )),

        Positioned(

            top: 245.h,

            left: 0,

            right: 0,

            child: const Center(

              child: Text(

                '我是自定义扫码相机',

                style: TextStyle(fontSize: 16, color: Colors.white),

              ),

            )),

        const Positioned(

            top: 80,

            left: 0,

            right: 0,

            bottom: 0,

            child: LoadAssetImage('scaner_bg')), // 全屏背景图

// 闪光灯

// Positioned(

// left: 0,

// right: 0,

// bottom: 100,

// child: StatefulBuilder(

// builder: (BuildContext context, StateSetter setState) {

// return MaterialButton(

// child: Center(

// child: Icon(

// lightIcon,

// size: 40,

// color: Colors.white,

// ),

// ),

// onPressed: () {

// _controller.toggleTorchMode();

// if (lightIcon == Icons.flash_on) {

// lightIcon = Icons.flash_off;

// } else {

// lightIcon = Icons.flash_on;

// }

// setState(() {});

// });

// },

// ),

// ),

      ]),

    );
  }


  /// 从相册选择

  Future _getImage() async {
//选择相册

    final ImagePicker _picker = ImagePicker();

// Pick an image

    final XFile? res = await _picker.pickImage(source: ImageSource.gallery);

    if (res != null) {
      String? result = await Scan.parse(res.path);

      print(result);

      if (result != null) {
        if (result!.contains('conditions...')) {
// 上送扫描结果到服务端

//_bindGroup(code: result ?? '', isReset: isFromReset);

        }
      } else {
        EasyLoading.showToast('无效的二维码');

// 重新激活相机

        _controller.resume();
      }
    }
  }
```
