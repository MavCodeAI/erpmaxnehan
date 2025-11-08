#!/bin/bash

# Fixed: Comprehensive dependency installation script for ERPMAX
echo "🚀 Installing ERPMAX Dependencies..."

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install @supabase/supabase-js@^2.80.0
npm install lucide-react@^0.548.0
npm install react@^19.2.0
npm install react-dom@^19.2.0
npm install react-hot-toast@^2.6.0
npm install react-router-dom@^7.9.4
npm install recharts@^3.3.0
npm install date-fns@^3.6.0
npm install clsx@^2.1.1
npm install tailwind-merge@^2.5.4

# Install development dependencies
echo "🔧 Installing development dependencies..."
npm install -D @types/node@^22.14.0
npm install -D @types/react@^19.2.2
npm install -D @types/react-dom@^19.2.2
npm install -D @vitejs/plugin-react@^5.0.0
npm install -D @typescript-eslint/eslint-plugin@^8.18.2
npm install -D @typescript-eslint/parser@^8.18.2
npm install -D autoprefixer@^10.4.20
npm install -D eslint@^9.17.0
npm install -D eslint-plugin-react-hooks@^5.1.0
npm install -D eslint-plugin-react-refresh@^0.4.16
npm install -D postcss@^8.4.49
npm install -D tailwindcss@^3.4.17
npm install -D typescript@~5.8.2
npm install -D vite@^6.2.0

echo "✅ Dependencies installed successfully!"
echo "🎯 Run 'npm run dev' to start the development server"
