function run() {
  SpreadsheetApp.openById(
    '1ESOTA1rTyqP-nkvmM-DAz4vffTNMhKoqUEQQcdP2QUc'
  ).appendRow([new Date(), Utilities.getUuid()]);
}
