const renderFiles = (list) => `<ul style="list-style-type:none;">${list.files.map(f => `<li>${f.name}<a href="/download-file/${f.id}">download</a></li>`).join('')}</ul>`;

module.exports = { renderFiles };