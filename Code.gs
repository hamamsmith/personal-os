/**
 * ========================================================
 * BACKEND API - PERSONAL OS (Google Apps Script)
 * ========================================================
 */

function doPost(e) {
  var response = { status: 'error', message: 'Unknown request' };
  
  try {
    var req = JSON.parse(e.postData.contents);
    var action = req.action;
    var data = req.data;
    
    if (action === 'saveBattle') {
      var sheet = getTargetSheet('Battle');
      var tsToSave = (data.date && data.date.length === 10) 
        ? (data.date + ' 23:59:00') 
        : getWIBTime();
      // Kolom: Timestamp | Battle | Outcome | Catatan | Kategori
      sheet.appendRow([tsToSave, data.type, data.outcomeVal, data.note, data.kategori]);
      response = { status: 'success' };
    } 
    else if (action === 'saveBrainDump') {
      var sheet = getTargetSheet('BrainDump');
      var values = sheet.getDataRange().getValues();
      var todayStr = getWIBTime().substring(0, 10);
      var rowToUpdate = -1;
      for(var i = 1; i < values.length; i++) {
         var tsRaw = values[i][0];
         var ts = (Object.prototype.toString.call(tsRaw) === '[object Date]') ? Utilities.formatDate(tsRaw, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") : String(tsRaw);
         if (ts.substring(0,10) === todayStr) {
            rowToUpdate = i + 1;
            break;
         }
      }
      if (rowToUpdate !== -1) {
         sheet.getRange(rowToUpdate, 1, 1, 2).setValues([[getWIBTime(), data]]);
      } else {
         sheet.appendRow([getWIBTime(), data]);
      }
      response = { status: 'success' };
    }
    else if (action === 'saveScreenTime') {
      var sheet = getTargetSheet('ScreenTime');
      var tsToSave = (data.date && data.date.length === 10) 
        ? (data.date + ' 23:59:00') 
        : getWIBTime();
      sheet.appendRow([
        tsToSave, 
        parseFloat(data.total) || 0, 
        data.app1Name, parseFloat(data.app1Dur) || 0, 
        data.app2Name, parseFloat(data.app2Dur) || 0, 
        data.app3Name, parseFloat(data.app3Dur) || 0
      ]);
      response = { status: 'success' };
    }
    else if (action === 'saveDebrief') {
      var sheet = getTargetSheet('Debrief');
      var tsToSave = (data.date && data.date.length === 10)
        ? (data.date + ' 23:59:00')
        : getWIBTime();
      sheet.appendRow([tsToSave, data.mood, data.energy, data.lesson, data.fix]);
      response = { status: 'success' };
    }
    else if (action === 'getDashboardData') {
      var bSheet  = getTargetSheet('Battle');
      var sSheet  = getTargetSheet('ScreenTime');
      var bdSheet = getTargetSheet('BrainDump');
      var dbSheet = getTargetSheet('Debrief');
      var bData   = bSheet.getDataRange().getValues();
      var sData   = sSheet.getDataRange().getValues();
      var bdData  = bdSheet.getDataRange().getValues();
      var dbData  = dbSheet.getDataRange().getValues();
      
      var allBattles    = [];
      var allScreenTimes = [];
      var allDebriefs   = [];
      var todayBrainDumpText = "";
      var pastBrainDumps = [];
      var todayStr = getWIBTime().substring(0, 10);
      
      // ---- Brain Dump ----
      if (bdData.length > 1) {
        for(var i = 1; i < bdData.length; i++) {
          var tsRaw = bdData[i][0];
          var ts = (Object.prototype.toString.call(tsRaw) === '[object Date]') ? Utilities.formatDate(tsRaw, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") : String(tsRaw);
          if (ts.substring(0,10) === todayStr) {
            todayBrainDumpText = bdData[i][1];
          } else {
            pastBrainDumps.push({ date: ts.substring(0,10), text: bdData[i][1] });
          }
        }
      }
      pastBrainDumps.reverse();
      
      // ---- Chart Setup (minggu ini) ----
      var positifArray = [0,0,0,0,0,0,0];
      var negatifArray  = [0,0,0,0,0,0,0];
      var now = new Date();
      var currentDay = now.getDay();
      var sundayDate = new Date();
      sundayDate.setDate(now.getDate() - currentDay);
      var chartLabels = [];
      var hariNames = ['Mgg','Sen','Sel','Rab','Kam','Jum','Sab'];
      var daysStr = [];
      for (var d = 0; d < 7; d++) {
        var dt = new Date(sundayDate.getTime());
        dt.setDate(sundayDate.getDate() + d);
        daysStr.push(Utilities.formatDate(dt, "Asia/Jakarta", "yyyy-MM-dd"));
        chartLabels.push([Utilities.formatDate(dt, "Asia/Jakarta", "dd/MM"), hariNames[d]]);
      }
      
      // ---- Battle Stats ----
      var totalPositif = 0, totalNegatif = 0;
      var positifBerhasil = 0, negatifTerkendali = 0;
      var freqPositif = {}, freqNegatif = {};
      
      if (bData.length > 1) {
        for (var i = 1; i < bData.length; i++) {
          var tsRaw  = bData[i][0];
          var ts     = (Object.prototype.toString.call(tsRaw) === '[object Date]') ? Utilities.formatDate(tsRaw, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") : String(tsRaw);
          var type    = String(bData[i][1] || '');
          var outcome = parseInt(bData[i][2]) || 0;
          var note    = String(bData[i][3] || '');
          // Index 4 = Kategori; data lama (kolom kosong) default → Negatif
          var kategori = String(bData[i][4] || 'Negatif').trim();
          if (kategori !== 'Positif') kategori = 'Negatif';
          
          allBattles.push({ ts: ts.substring(0,16), type: type, outcome: outcome, note: note, kategori: kategori });
          
          if (kategori === 'Positif') {
            totalPositif++;
            if (outcome >= 4) positifBerhasil++;
            freqPositif[type] = (freqPositif[type] || 0) + 1;
          } else {
            totalNegatif++;
            if (outcome >= 4) negatifTerkendali++;
            freqNegatif[type] = (freqNegatif[type] || 0) + 1;
          }
          
          // Chart: menang (outcome>=4, apapun kategorinya) vs kalah (outcome<=2)
          var rowDate = ts.substring(0,10);
          var idx = daysStr.indexOf(rowDate);
          if (idx !== -1) {
            if (outcome >= 4) positifArray[idx]++;       // semua kemenangan → hijau
            else if (outcome <= 2) negatifArray[idx]++;  // semua kekalahan  → merah
          }
        }
      }
      
      var successRate = totalPositif > 0 ? Math.round(positifBerhasil / totalPositif * 100) : 0;
      var kontrolRate = totalNegatif > 0 ? Math.round(negatifTerkendali / totalNegatif * 100) : 0;
      
      var sortedPos = Object.keys(freqPositif).sort(function(a,b){ return freqPositif[b] - freqPositif[a]; });
      var sortedNeg = Object.keys(freqNegatif).sort(function(a,b){ return freqNegatif[b] - freqNegatif[a]; });
      var mostPositif = sortedPos.length > 0 ? sortedPos[0] : null;
      var mostNegatif = sortedNeg.length > 0 ? sortedNeg[0] : null;
      
      // Top 3 freq (gabungan, untuk chart "Battle Paling Sering")
      var freqAll = {};
      Object.keys(freqPositif).forEach(function(k){ freqAll[k] = (freqAll[k]||0) + freqPositif[k]; });
      Object.keys(freqNegatif).forEach(function(k){ freqAll[k] = (freqAll[k]||0) + freqNegatif[k]; });
      var sortedAll = Object.keys(freqAll).sort(function(a,b){ return freqAll[b] - freqAll[a]; });
      var top3Labels = [], top3Data = [], top3Kategori = [];
      for(var f = 0; f < Math.min(3, sortedAll.length); f++) {
        var key = sortedAll[f];
        top3Labels.push(key);
        top3Data.push(freqAll[key]);
        // Tentukan kategori: Positif jika ada di freqPositif, sebaliknya Negatif
        top3Kategori.push(freqPositif[key] ? 'Positif' : 'Negatif');
      }
      
      // ---- Screen Time ----
      var totalScreen = 0;
      if (sData.length > 1) {
        for (var j = 1; j < sData.length; j++) {
          totalScreen += parseFloat(sData[j][1]) || 0;
          var tsRaw = sData[j][0];
          var ts = (Object.prototype.toString.call(tsRaw) === '[object Date]') ? Utilities.formatDate(tsRaw, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") : String(tsRaw);
          var safeDur = function(v) {
            if (Object.prototype.toString.call(v) !== '[object Date]') return parseFloat(v) || 0;
            try {
              var dv = parseInt(Utilities.formatDate(v, "Asia/Jakarta", "d"));
              var mv = Utilities.formatDate(v, "Asia/Jakarta", "MM");
              return parseFloat(dv + "." + mv) || 0;
            } catch(e) { return 0; }
          };
          allScreenTimes.push({ 
            date: ts.substring(0,10), total: sData[j][1], 
            a1: sData[j][2], d1: safeDur(sData[j][3]), 
            a2: sData[j][4], d2: safeDur(sData[j][5]), 
            a3: sData[j][6], d3: safeDur(sData[j][7])
          });
        }
      }
      var avgScreen = sData.length > 1 ? (totalScreen / (sData.length - 1)).toFixed(1) : 0;
      
      // ---- Debrief ----
      if (dbData.length > 1) {
        for(var k = 1; k < dbData.length; k++) {
          var tsRaw = dbData[k][0];
          var ts = (Object.prototype.toString.call(tsRaw) === '[object Date]') ? Utilities.formatDate(tsRaw, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") : String(tsRaw);
          allDebriefs.push({ date: ts.substring(0,10), mood: dbData[k][1], energy: dbData[k][2], lesson: dbData[k][3], fix: dbData[k][4] });
        }
      }
      
      allBattles.reverse();
      allScreenTimes.reverse();
      allDebriefs.reverse();
      
      response = { 
        status: 'success', 
        summary: { 
          totalPositif: totalPositif, totalNegatif: totalNegatif,
          successRate: successRate, kontrolRate: kontrolRate,
          mostPositif: mostPositif, mostNegatif: mostNegatif,
          avgScreen: avgScreen
        },
        allBattles: allBattles,
        allScreenTimes: allScreenTimes,
        allDebriefs: allDebriefs,
        todayBrainDumpText: todayBrainDumpText,
        pastBrainDumps: pastBrainDumps,
        chartData: { 
          winLoseLabels: chartLabels, 
          positifData: positifArray, 
          negatifData: negatifArray,
          freqLabels: top3Labels, 
          freqData: top3Data,
          freqKategori: top3Kategori
        }
      };
    }
  } catch(err) {
    response = { status: 'error', message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) { return ContentService.createTextOutput("Personal OS API is Active!"); }
function getWIBTime() { return Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss"); }

function getTargetSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === 'Battle') {
      sheet.appendRow(['Timestamp', 'Battle', 'Outcome', 'Catatan', 'Kategori']);
    } else if (sheetName === 'BrainDump') {
      sheet.appendRow(['Timestamp', 'Isi_Pikiran']);
    } else if (sheetName === 'ScreenTime') {
      sheet.appendRow(['Timestamp', 'Total_Durasi', 'App_1', 'Durasi_1', 'App_2', 'Durasi_2', 'App_3', 'Durasi_3']);
    } else if (sheetName === 'Debrief') {
      sheet.appendRow(['Timestamp', 'Mood', 'Level_Energi', 'Pelajaran_Penting', 'Target_Perbaikan']);
    }
    sheet.getRange("1:1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}
