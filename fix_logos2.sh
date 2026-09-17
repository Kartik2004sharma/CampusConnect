#!/bin/bash

# page.jsx navbar
perl -0777 -pi -e 's/<div className="flex items-center gap-0\.5 -ml-2">\s*<div className="w-12 h-12 flex items-center justify-center overflow-hidden"><img src="\/logo\.png" alt="CampusConnect" className="w-full h-full object-cover scale-\[2\.2\]" \/><\/div>\s*<span className="text-xl font-bold tracking-tight">CampusConnect<\/span>\s*<\/div>/<div className="flex items-center gap-2">\n          <img src="\/logo.jpg" alt="CampusConnect" className="w-10 h-10 object-contain" \/>\n          <span className="text-xl font-bold tracking-tight">CampusConnect<\/span>\n        <\/div>/g' client/src/app/page.jsx

# page.jsx footer
perl -0777 -pi -e 's/<div className="flex items-center gap-0\.5 mb-6 -ml-2">\s*<div className="w-12 h-12 flex items-center justify-center overflow-hidden"><img src="\/logo\.png" alt="CampusConnect" className="w-full h-full object-cover scale-\[2\.2\]" \/><\/div>\s*<span className="text-xl font-bold tracking-tight">CampusConnect<\/span>\s*<\/div>/<div className="flex items-center gap-2 mb-6">\n                <img src="\/logo.jpg" alt="CampusConnect" className="w-9 h-9 object-contain" \/>\n                <span className="text-xl font-bold tracking-tight">CampusConnect<\/span>\n              <\/div>/g' client/src/app/page.jsx

# AppShell.jsx sidebar
perl -0777 -pi -e 's/<Link href="\/" className="text-xl font-bold tracking-tight text-\[var\(--color-text-primary\)\] flex items-center gap-0\.5 -ml-2 group">\s*<div className="w-12 h-12 flex items-center justify-center overflow-hidden"><img src="\/logo\.png" alt="CampusConnect" className="w-full h-full object-cover scale-\[2\.2\]" \/><\/div>\s*CampusConnect\s*<\/Link>/<Link href="\/" className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2 group">\n            <img src="\/logo.jpg" alt="CampusConnect" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" \/>\n            CampusConnect\n          <\/Link>/g' client/src/layouts/AppShell.jsx

