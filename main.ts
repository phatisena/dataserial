
//%block="DataSerial"
//%color="#44d4ca"
//%icon="\uf187"
namespace dataserial {
    
    let cidk: {[key:string]:number} = {}

    //%block="$name"
    //%blockId=dataserial_indexkeyshadow
    //%blockHidden=true shim=TD_ID
    //%name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //%name.fieldOptions.key="dataserialindexkey"
    export function _indexKeyShadow(name: string) {
        return name
    }

    //%blockid=dataserial_startindexkey
    //%block="start read in $name by $start"
    //%name.shadow="dataserial_indexkeyshadow" name.defl="myIdxKey"
    //%group="index key"
    //%weight=10
    export function startIdxKey(name:string,start:number) {
        cidk[name] = start
    }

    //%blockid=dataserial_getindexkey
    //%block="get $name from index key"
    //%name.shadow="dataserial_indexkeyshadow" name.defl="myIdxKey"
    //%group="index key"
    //%weight=5
    export function getIdxKey(name:string) {
        return cidk[name]
    }

    //%blockid=dataserial_writevalue
    //%block="write $strval"
    //%group="write and read"
    //%weight=10
    export function write(strval:string) {
        let oval = "", curc = ""
        for (let i = 0;i < strval.length;i++) {
            curc = strval.charAt(i)
            if ("\\|".includes(curc)) {
                oval = "" + oval + "\\"
            }
            oval = "" + oval + curc
        }
        oval = "" + oval + "|"
        return oval
    }

    //%blockid=dataserial_readvalue
    //%block="read $txt from idx key $name"
    //%name.shadow="dataserial_indexkeyshadow" name.defl="myIdxKey"
    //%group="write and read"
    //%weight=5
    export function read(txt:string,name:string) {
        if (cidk[name] == null) return "";
        let idx = cidk[name]
        let oval = "", curc = ""
        while (idx < txt.length) {
            curc = txt.charAt(idx)
            if ("|".includes(curc)) {
                break
            } else if ("\\".includes(curc)) {
                idx += 1
                curc = txt.charAt(idx)
            }
            oval = "" + oval + curc
            idx += 1
        }
        idx += 1, cidk[name] = idx
        return oval
    }

    //%blockid=dataserial_saveimage
    //%block="save image $InputImg=screen_image_picker to string data"
    //%group="image data"
    //%weight=10
    export function saveImg(InputImg: Image) {
        let OutputStr = ""
        OutputStr = "" + OutputStr + write("image")
        OutputStr = "" + OutputStr + write("img.1")
        OutputStr = "" + OutputStr + write(convertToText(InputImg.width))
        OutputStr = "" + OutputStr + write(convertToText(InputImg.height))
        let NumVal = InputImg.getPixel(0, 0)
        let Count = 1, Ix = 0, Iy = 0
        for (let  index = 0; index <= InputImg.width * InputImg.height - 2; index++) {
            Ix = (index + 1) % InputImg.width
            Iy = Math.floor((index + 1) / InputImg.width)
            if (NumVal == InputImg.getPixel(Ix, Iy)) {
                Count += 1
            } else {
                OutputStr = "" + OutputStr + write(convertToText(Count))
                OutputStr = "" + OutputStr + write(convertToText(NumVal))
                NumVal = InputImg.getPixel(Ix, Iy)
                Count = 1
            }
        }
        OutputStr = "" + OutputStr + write(convertToText(Count))
        OutputStr = "" + OutputStr + write(convertToText(NumVal))
        OutputStr = "" + OutputStr + write("ENDimg")
        return OutputStr
    }

    //%blockid=dataserial_loadimage
    //%block="load image $DataStr from string data"
    //%group="image data"
    //%weight=5
    export function loadImg(DataStr: string) {
        startIdxKey("_ImgData", 0)
        let StrVal = read(DataStr, "_ImgData")
        let NumVal = 0, Ix = 0, Iy = 0
        if (!(StrVal.includes("image"))) {
            return undefined
        }
        StrVal = read(DataStr, "_ImgData")
        if (!(StrVal.includes("img."))) {
            return undefined
        }
        let Widt = parseFloat(read(DataStr, "_ImgData"))
        let Heig = parseFloat(read(DataStr, "_ImgData"))
        let OutputImg = image.create(Widt, Heig)
        let I = 0
        let CountStr = read(DataStr, "_ImgData")
        let Count = parseFloat(CountStr)
        while (getIdxKey("_ImgData") < DataStr.length) {
            Ix = I % Widt
            Iy = Math.floor(I / Widt)
            NumVal = parseFloat(read(DataStr, "_ImgData"))
            for (let index = 0; index < Count; index++) {
                OutputImg.setPixel(Ix, Iy, NumVal)
                I += 1
                Ix = I % Widt
                Iy = Math.floor(I / Widt)
            }
            CountStr = read(DataStr, "_ImgData")
            if (CountStr.includes("END")) {
                break;
            }
            Count = parseFloat(CountStr)
        }
        return OutputImg
    }
}
