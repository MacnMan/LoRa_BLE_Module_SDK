// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler


// const data =[0x01, 0x00, 0x07, 0xD7, 0x7D, 0x43, 0x6A, 0x07, 0x53, 0xBF, 0x42, 0xEB, 0x07, 0x35, 0x52, 0x42, 0xEB, 0x0A, 0x07, 0x42, 0x4D, 0x42, 0x48, 0x00, 0x00, 0x7A, 0x9C];

// console.log(Decoder(data));
// decoding uploaded data
function decodeUplink(input) {
    return {
        data: {
            Payload: Decoder(input.bytes, input.port),
        },
        warnings: [],
        errors: []
    };
}
// bytes to string
function str_pad(byte) {
    var zero = '00';
    var hex = byte.toString(16);
    var tmp = 2 - hex.length;
    return zero.substr(0, tmp) + hex + "";
}
// Decoder
function Decoder(bytes, port) {
    var decode = {};
    var devInfo = {};
    devInfo.Mode = bytes[0];
    devInfo.devType = bytes[1];
    devInfo.length = bytes.length;
    if (devInfo.devType === 0) { // if message type is payload and devType is RS485_Node
        decode.devType = "RS485_Node";
        decode.manufacturer = "Macnman India";
        decode.protocall = "LoRaWAN";
        decode.uplinkPort = port;
        decode.data = getRS485Data(bytes);
    } else if (devInfo.devType === 1) { // if message type is payload and devType is analog device
        decode.devType = "Analog_Node";
        decode.devType = "RS485_Node";
        decode.manufacturer = "Macnman India";
        decode.protocall = "LoRaWAN";
        decode.uplinkPort = port;
        decode.data = getAnalogData(bytes);
    }else if (devInfo.devType === 2) { // if message type is payload and devType is analog device
        decode.devType = "Analog_Node";
        decode.devType = "Relay_Controller";
        decode.manufacturer = "Macnman India";
        decode.protocall = "LoRaWAN";
        decode.uplinkPort = port;
        switch(bytes[0]){
            case 0:
                decode.boot = getFanData(bytes);
                break;
            case 1:
                decode.payload = getFanData(bytes);
                break;
            case 2:
                decode.responce = getFanData(bytes);
            break;
            default:
                break;
        }
        
    }else if (devInfo.devType === 255) { // if message type is payload and devType is analog device
        decode.devType = "Analog_Node";
        decode.devType = "Curton_Controller";
        decode.manufacturer = "Macnman India";
        decode.protocall = "LoRaWAN";
        decode.uplinkPort = port;
        switch(bytes[0]){
            case 0:
                decode.boot = getCurtonData(bytes);
                break;
            case 1:
                decode.payload = getCurtonData(bytes);
                break;
            case 2:
                decode.responce = getCurtonData(bytes);
            break;
            default:
                break;
        }
        
    }
    return decode;
}
// decoder for relay based fan control
function getFanData(bytes){
    
    if(bytes[0]===0){
        var boot_data = {};
        var fieldIndex = 1;
        boot_data.messageType = "Boot Message";
        boot_data.OEM_ID = str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]);
        boot_data.FR = str_pad(bytes[++fieldIndex]) + "."+str_pad(bytes[++fieldIndex])+ "."+str_pad(bytes[++fieldIndex]);
        boot_data.HW = str_pad(bytes[++fieldIndex]) + "."+str_pad(bytes[++fieldIndex]) + "."+ str_pad(bytes[++fieldIndex]);
        boot_data.TDCM = (bytes[++fieldIndex] << 8 | bytes[++fieldIndex]); //millisec
        boot_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
        return boot_data;
    }else if(bytes[0]==1){
        var payload_data = {};
        var fieldIndex = 1;
        payload_data.messageType = "Payload";
        payload_data.fan1_satus =bytes[++fieldIndex] ? "on":"off";
        payload_data.fan2_satus =bytes[++fieldIndex] ? "on":"off";
        payload_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
        return payload_data;
    }else if(bytes[0]==2){
        var responce_data = {};
        var fieldIndex = 1;
        responce_data.messageType = "Responce Message";
        switch(bytes[++fieldIndex]){
            case 5:
                responce_data.fan1_satus =bytes[++fieldIndex] ? "on":"off";
                responce_data.fan2_satus =bytes[++fieldIndex] ? "on":"off";
                responce_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
            return responce_data;
            case 6:
                responce_data.TDCM =(bytes[++fieldIndex] << 8 | bytes[++fieldIndex]);
                responce_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
            return responce_data;
            case 7:
                responce_data.offline_status =bytes[++fieldIndex] ? "on":"off";
                responce_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
            return responce_data;

        }
 
    }

}
// decoder for relay based fan control
function getCurtonData(bytes){
    if(bytes[0]===0){
        var boot_data = {};
        var fieldIndex = 1;
        boot_data.messageType = "Boot Message";
        boot_data.OEM_ID = str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]) + str_pad(bytes[++fieldIndex]);
        boot_data.FR = str_pad(bytes[++fieldIndex]) + "."+str_pad(bytes[++fieldIndex])+ "."+str_pad(bytes[++fieldIndex]);
        boot_data.HW = str_pad(bytes[++fieldIndex]) + "."+str_pad(bytes[++fieldIndex]) + "."+ str_pad(bytes[++fieldIndex]);
        boot_data.TDCM = (bytes[++fieldIndex] << 8 | bytes[++fieldIndex]); //millisec
        boot_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
        return boot_data;
    }else if(bytes[0]==1){
        var payload_data = {};
        var fieldIndex = 1;
        payload_data.messageType = "Payload";
        payload_data.actual_position =bytes[++fieldIndex];
        payload_data.recorded_position =bytes[++fieldIndex];
        payload_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
        return payload_data;
    }else if(bytes[0]==2){
        var responce_data = {};
        var fieldIndex = 1;
        responce_data.messageType = "Responce Message";
        switch(bytes[++fieldIndex]){
            case 5:
                responce_data.actual_position =bytes[++fieldIndex];
                responce_data.recorded_position =bytes[++fieldIndex];
                responce_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
            return responce_data;
            case 6:
                responce_data.TDCM =(bytes[++fieldIndex] << 8 | bytes[++fieldIndex]);
                responce_data.Systimestamp = (bytes[++fieldIndex] << 24) + (bytes[++fieldIndex] << 16) + (bytes[++fieldIndex] << 8) + bytes[++fieldIndex];
            return responce_data;
        }
 
    }

}
//
function getAnalogData(bytes) {
    var analog_data = {};
    var fieldIndex = 0;
    for (var byteIndex = 2; byteIndex <= (bytes.length - 5); ++byteIndex) {
        switch (bytes[byteIndex]) {
            case 0:
                analog_data["channel_" + String.fromCharCode(97 + fieldIndex)] = "disabled";
                break;
            case 1:
                analog_data["channel_" + String.fromCharCode(97 + fieldIndex) + "_crrent"] = ((bytes[++byteIndex] << 8) | bytes[++byteIndex]);
                break;
            case 2:
                analog_data["channel_" + String.fromCharCode(97 + fieldIndex) + "_voltage"] = ((bytes[++byteIndex] << 8) | bytes[++byteIndex]);
                break;
            default:
                break;
        }
        fieldIndex++;
    }
    analog_data.Systimestamp = (bytes[byteIndex] << 24) + (bytes[++byteIndex] << 16) + (bytes[++byteIndex] << 8) + bytes[++byteIndex];
    return analog_data;
}
//  function for decoding rs485 sensor
function getRS485Data(bytes) {
    var rs485_data = {};
    var fieldIndex = 1;
    for (var byteIndex = 2; byteIndex <= (bytes.length - 5); ++byteIndex) {
        // console.log(byteIndex);
        let key = "field" + fieldIndex.toString();
        switch (bytes[byteIndex]) {
            case 0:
                var unsignedValue = ((bytes[++byteIndex] << 8) | bytes[++byteIndex]);
                rs485_data[key] = (unsignedValue & 0x8000) ? -(0x10000 - unsignedValue) : unsignedValue;
                break;
            case 1:
                rs485_data[key] = ((bytes[++byteIndex] << 8) | bytes[++byteIndex]);
                break;
            case 2:
                var unsignedValue= (bytes[++byteIndex] << 24 | bytes[++byteIndex] << 16 | bytes[++byteIndex] << 8 | bytes[++byteIndex]);
                rs485_data[key] = (unsignedValue & 0x8000) ? -(0x10000 - unsignedValue) : unsignedValue;
                break;
            case 3:
                // reverse
                var unsignedValue= (bytes[++byteIndex] << 24 | bytes[++byteIndex] << 16 | bytes[++byteIndex] << 8 | bytes[++byteIndex]);
                rs485_data[key] = (unsignedValue & 0x8000) ? -(0x10000 - unsignedValue) : unsignedValue;
                break;
            case 4:
                rs485_data[key] = parseFloat(GetFloat([bytes[++byteIndex], bytes[++byteIndex], bytes[++byteIndex], bytes[++byteIndex]], 0).toFixed(3));
                break;
            case 5:
                // reverse
                rs485_data[key] = parseFloat(GetFloat([bytes[++byteIndex], bytes[++byteIndex], bytes[++byteIndex], bytes[++byteIndex]], 1).toFixed(3));
                break;
            case 10:
                rs485_data[key] = "Slave Error";
                break;
            case 11:
                rs485_data[key] = "Disabled";
                break;
            default:
                break;
        }
        fieldIndex++;
    }
   rs485_data.Systimestamp = (bytes[byteIndex] << 24) + (bytes[++byteIndex] << 16) + (bytes[++byteIndex] << 8) + bytes[++byteIndex];
    return rs485_data;
}
// returns a float value from 4 bytes
function GetFloat(dataBytes, isMsb) {
    // Create a new ArrayBuffer with 4 bytes of data
    const buffer = new ArrayBuffer(4);
    // Create a DataView to work with the buffer
    const view = new DataView(buffer);
    var startbit = 0;
    if(isMsb){
        view.setUint8(0, dataBytes[startbit++]); // Byte 0 (most significant byte)
        view.setUint8(1, dataBytes[startbit++]); // Byte 1
        view.setUint8(2, dataBytes[startbit++]); // Byte 2
        view.setUint8(3, dataBytes[startbit++]); // Byte 3 (least significant byte)
        return view.getFloat32(0, false); // true indicates little-endian byte order
    }
    view.setUint8(2, dataBytes[startbit++]); // Byte 2
    view.setUint8(3, dataBytes[startbit++]); // Byte 3 (least significant byte)
    view.setUint8(0, dataBytes[startbit++]); // Byte 0 (most significant byte)
    view.setUint8(1, dataBytes[startbit++]); // Byte 1
    return view.getFloat32(0, false); // true indicates little-endian byte order
}
