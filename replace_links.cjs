const fs = require('fs');
const path = './src/data/projects.ts';

const pixabayVideos = [
  'https://cdn.pixabay.com/video/2020/02/18/32492-393009498_large.mp4',
  'https://cdn.pixabay.com/video/2024/01/25/198078-906029691_large.mp4',
  'https://cdn.pixabay.com/video/2022/07/20/124902-732236498_large.mp4',
  'https://cdn.pixabay.com/video/2021/04/10/71080-536982808_large.mp4',
  'https://cdn.pixabay.com/video/2023/10/06/183868-872276498_large.mp4',
  'https://cdn.pixabay.com/video/2023/04/11/158635-816700980_large.mp4',
  'https://cdn.pixabay.com/video/2020/07/30/45643-446457947_large.mp4',
  'https://cdn.pixabay.com/video/2020/10/29/54020-475717399_large.mp4',
  'https://cdn.pixabay.com/video/2021/02/11/64608-511682498_large.mp4',
  'https://cdn.pixabay.com/video/2021/10/12/91416-633860638_large.mp4',
  'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4'
];

let content = fs.readFileSync(path, 'utf-8');
let i = 0;
content = content.replace(/video:\s*'https:\/\/drive\.google\.com[^']+'/g, (match) => {
  const replacement = `video: '${pixabayVideos[i % pixabayVideos.length]}'`;
  i++;
  return replacement;
});

fs.writeFileSync(path, content);
console.log('Replaced all drive links with placeholders');
