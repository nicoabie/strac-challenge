const renderFiles = (list) => `<ul style="list-style-type:none;">${list.files.map(f => `<li>${f.name} <a href="/download-file/${f.id}">download</a> <a href="/watch/${f.id}">watch</a></li>`).join('')}</ul>`;

const renderWatchPage = (fileId) => `
  <html>
    <body>
      <a href="/list-files">go back</a>
      <h2>who has access?</h2> 
      <div id="users"></div>
    </body>
    <script>
      const events = new EventSource('/watch-file/${fileId}');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        const formatter = new Intl.ListFormat('en', {
          style: 'long',
          type: 'conjunction',
        });

        document.querySelector('#users').innerHTML = formatter.format(parsedData.map(u => u.displayName));
      };
    </script>
</html>
`

module.exports = { renderFiles, renderWatchPage };