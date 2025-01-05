
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
    export function _imageArrayNameShadow(name: string) {
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
}
