#!/bin/bash

# page.jsx navbar
sed -i '' 's/<div className="flex items-center gap-3">/<div className="flex items-center gap-0.5 -ml-2">/g' client/src/app/page.jsx
sed -i '' 's/<div className="flex items-center justify-center">\n            <img src="\/logo.png" alt="CampusConnect" className="w-14 h-14 object-contain scale-125" \/>\n          <\/div>/<div className="w-12 h-12 flex items-center justify-center overflow-hidden">\n            <img src="\/logo.png" alt="CampusConnect" className="w-full h-full object-cover scale-[2.2]" \/>\n          <\/div>/g' client/src/app/page.jsx

# page.jsx footer
sed -i '' 's/<div className="flex items-center gap-2 mb-6">/<div className="flex items-center gap-0.5 mb-6 -ml-2">/g' client/src/app/page.jsx
sed -i '' 's/<div className="flex items-center justify-center">\n                  <img src="\/logo.png" alt="CampusConnect" className="w-12 h-12 object-contain scale-125" \/>\n                <\/div>/<div className="w-10 h-10 flex items-center justify-center overflow-hidden">\n                  <img src="\/logo.png" alt="CampusConnect" className="w-full h-full object-cover scale-[2.2]" \/>\n                <\/div>/g' client/src/app/page.jsx

# AppShell.jsx sidebar
sed -i '' 's/<Link href="\/" className="text-xl font-bold tracking-tight text-\[var(--color-text-primary)\] flex items-center gap-2 group">/<Link href="\/" className="text-xl font-bold tracking-tight text-\[var(--color-text-primary)\] flex items-center gap-0.5 -ml-2 group">/g' client/src/layouts/AppShell.jsx
sed -i '' 's/<div className="flex items-center justify-center">\n              <img src="\/logo.png" alt="CampusConnect" className="w-12 h-12 object-contain scale-125" \/>\n            <\/div>/<div className="w-12 h-12 flex items-center justify-center overflow-hidden">\n              <img src="\/logo.png" alt="CampusConnect" className="w-full h-full object-cover scale-[2.2]" \/>\n            <\/div>/g' client/src/layouts/AppShell.jsx

