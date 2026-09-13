#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('\n🚀 Starter Story - Setup Automático\n');

// Verificar .env
console.log('1️⃣  Verificando .env...');
if (!fs.existsSync('.env')) {
  console.log('   ❌ .env não encontrado!');
  console.log('   ℹ️  Criando .env com placeholder...\n');
  fs.writeFileSync('.env', 'GEMINI_API_KEY=\nYOUTUBE_API_KEY=\n');
  console.log('   ⚠️  ADICIONE suas API keys em .env\n');
} else {
  console.log('   ✅ .env encontrado\n');
}

// Instalar dependências raiz
console.log('2️⃣  Instalando dependências da raiz...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Dependências raiz instaladas\n');
} catch (error) {
  console.error('   ❌ Erro ao instalar dependências');
  process.exit(1);
}

// Instalar dependências web
console.log('3️⃣  Instalando dependências do React...');
try {
  execSync('cd web && npm install', { stdio: 'inherit' });
  console.log('   ✅ Dependências do React instaladas\n');
} catch (error) {
  console.error('   ❌ Erro ao instalar dependências do React');
  process.exit(1);
}

console.log('✨ Setup concluído!\n');
console.log('📋 Próximos passos:');
console.log('   1. Adicione suas API keys em .env');
console.log('   2. Execute: npm run analyze 5  (para testar)');
console.log('   3. Depois: npm run dev  (para ver no dashboard)\n');
