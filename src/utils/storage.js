const STORAGE_KEY_SEMESTERS = 'unigrade_semesters_v1';
const STORAGE_KEY_SCALE = 'unigrade_scale_v1';
const STORAGE_KEY_CUSTOM_SCALES = 'unigrade_custom_scales_v1';
const STORAGE_KEY_THEME = 'unigrade_theme_v1';
const STORAGE_KEY_STUDENT_INFO = 'unigrade_student_info_v1';

export function saveState(semesters, scaleId, customScales, studentInfo) {
  try {
    localStorage.setItem(STORAGE_KEY_SEMESTERS, JSON.stringify(semesters));
    localStorage.setItem(STORAGE_KEY_SCALE, JSON.stringify(scaleId));
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCALES, JSON.stringify(customScales));
    localStorage.setItem(STORAGE_KEY_STUDENT_INFO, JSON.stringify(studentInfo));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function loadState() {
  try {
    const semesters = localStorage.getItem(STORAGE_KEY_SEMESTERS);
    const scaleId = localStorage.getItem(STORAGE_KEY_SCALE);
    const customScales = localStorage.getItem(STORAGE_KEY_CUSTOM_SCALES);
    const studentInfo = localStorage.getItem(STORAGE_KEY_STUDENT_INFO);

    return {
      semesters: semesters ? JSON.parse(semesters) : null,
      scaleId: scaleId ? JSON.parse(scaleId) : null,
      customScales: customScales ? JSON.parse(customScales) : {},
      studentInfo: studentInfo ? JSON.parse(studentInfo) : { name: '', id: '', university: '', major: '' }
    };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return { semesters: null, scaleId: null, customScales: {}, studentInfo: null };
  }
}

export function exportBackupFile(data) {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    ...data
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const studentName = data.studentInfo?.name ? data.studentInfo.name.replace(/\s+/g, '_') : 'Student';
  downloadAnchor.setAttribute('download', `UniGrade_Backup_${studentName}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.semesters || !Array.isArray(json.semesters)) {
          throw new Error('Invalid UniGrade backup file structure.');
        }
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
