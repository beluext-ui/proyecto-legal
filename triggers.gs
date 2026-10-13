// [ACTION_REQUIRED]: Update with your Google Sheets ID
//const SPREADSHEET_ID = '1Fg4a2PzXApzGhlfkTohQQT1cy-GnZ1e7b-jzRXZ-_1I';

function crearActivadorFormulario() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Primero, verificamos si ya existe para no duplicarlo
  var triggers = ScriptApp.getUserTriggers(ss);
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onFormSubmit') {
        Logger.log('El activador ya existe.');
        return; // Si ya existe, no hacemos nada
      }
  }
  
  // Creamos el nuevo activador
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
  
  Logger.log('Activador creado exitosamente.');
}