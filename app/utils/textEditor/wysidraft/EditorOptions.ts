import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import imageCompression from "browser-image-compression"
import uploadImageCallBack from "app/utils/textEditor/wysidraft/uploadCallback"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "draft-js/dist/Draft.css"
const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fontsize: 24,
}
const EditorOptions = {
  options: [
    "colorPicker",
    "fontSize",
    "emoji",
    "image",
    "fontFamily",
    "embedded",
    "link",
    "list",
    "textAlign",
    "inline",
    "history",
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["bold", "italic", "underline", "strikethrough"],
  },
  fontSize: {
    options: [16, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  image: {
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    uploadCallback: async (file: File) => {
      const fileCompress = await imageCompression(file, options)
      file = fileCompress as File
      const res = await uploadImageCallBack(file as File)
      return res
    },
    previewImage: true,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "auto",
      width: "auto",
    },
  },
  embedded: {
    icon: undefined,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    embedCallback: undefined,
    defaultSize: {
      height: "auto",
      width: "auto",
    },
  },
  colorPicker: {
    component: undefined,
    popupClassName: undefined,
    colors: [
      "#3366cc",
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00",
      "#b82e2e",
      "#316395",
      "#3366cc",
      "#994499",
      "#22aa99",
      "#aaaa11",
      "#6633cc",
      "#e67300",
      "#8b0707",
      "#651067",
      "#329262",
      "#5574a6",
      "#3b3eac",
      "#b77322",
      "#16d620",
      "#b91383",
      "#f4359e",
      "#9c5935",
      "#a9c413",
      "#2a778d",
      "#668d1c",
      "#bea413",
      "#0c5922",
      "#743411",
    ],
  },
}
export default EditorOptions
