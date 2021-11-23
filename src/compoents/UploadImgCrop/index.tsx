/*
 * @Author: your name
 * @Date: 2021-11-23 08:41:36
 * @LastEditTime: 2021-11-23 11:41:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/UploadImgCrop/index.tsx
 */
import React, { useState } from "react";
import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { uploadAvatar } from "api/system/user";

interface Iporps {
  [x: string]: any;
  size: number;
}

const UploadImgCrop = (props: Iporps, ref: any) => {
  const [fileList, setFileList] = useState<any>([
    // {
    //   uid: "-1",
    //   name: "image.png",
    //   status: "done",
    //   url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    // },
  ]);

  function onChange({ fileList: newFileList }: any) {
    setFileList(newFileList);
  }

  async function onPreview(file: any) {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow: any = window.open(src);
    imgWindow.document.write(image.outerHTML);
  }
  function beforeUpload(file: any) {
    if (file.type.indexOf("image/") === -1) {
      message.error("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
    }
    let formData = new FormData();
    formData.append("avatarfile", file);

    uploadAvatar(formData)
      .then((response: any) => {
        console.log(process.env.REACT_APP_BASE_API + response.imgUrl);
        props.importAfterMethods(process.env.REACT_APP_BASE_API + response.imgUrl);
        message.success("修改成功");
      })
      // // 测试使用
      // .catch((err) => {
      //   props.importAfterMethods("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");
      // });
    return false;
  }
  return (
    <ImgCrop rotate>
      <Upload listType="picture-card" fileList={fileList} onChange={onChange} beforeUpload={beforeUpload} onPreview={onPreview}>
        <div ref={ref}>{fileList.length < props.size && "+ Upload"}</div>
      </Upload>
    </ImgCrop>
  );
};

export default React.forwardRef(UploadImgCrop);
