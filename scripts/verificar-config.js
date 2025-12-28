#!/usr/bin/env node

/**
 * Script para verificar se as variáveis de ambiente estão configuradas corretamente
 */

require('dotenv').config();

const checks = [
  {
    name: 'DATABASE_URL',
    value: process.env.DATABASE_URL,
    required: true,
    validator: (val) => val && val.startsWith('file:'),
  },
  {
    name: 'AUTH_SECRET',
    value: process.env.AUTH_SECRET,
    required: true,
    validator: (val) => val && val.length >= 32 && val !== 'sua-chave-secreta-aqui-mude-para-uma-chave-aleatoria',
  },
  {
    name: 'NEXTAUTH_URL',
    value: process.env.NEXTAUTH_URL,
    required: true,
    validator: (val) => val && (val === 'http://localhost:3000' || val.includes('localhost')),
  },
  {
    name: 'AUTH_GOOGLE_ID',
    value: process.env.AUTH_GOOGLE_ID,
    required: true,
    validator: (val) => val && val.includes('.apps.googleusercontent.com') && val !== 'seu-google-client-id-aqui',
  },
  {
    name: 'AUTH_GOOGLE_SECRET',
    value: process.env.AUTH_GOOGLE_SECRET,
    required: true,
    validator: (val) => val && val.startsWith('GOCSPX-') && val !== 'seu-google-client-secret-aqui',
  },
];

console.log('🔍 Verificando configuração do .env...\n');

let allPassed = true;

checks.forEach((check) => {
  const exists = !!check.value;
  const isValid = exists && (!check.validator || check.validator(check.value));

  if (!exists && check.required) {
    console.log(`❌ ${check.name}: NÃO CONFIGURADO`);
    allPassed = false;
  } else if (!isValid) {
    console.log(`⚠️  ${check.name}: CONFIGURADO MAS INVÁLIDO`);
    if (check.name === 'AUTH_GOOGLE_ID') {
      console.log('   → Deve terminar com .apps.googleusercontent.com');
    } else if (check.name === 'AUTH_GOOGLE_SECRET') {
      console.log('   → Deve começar com GOCSPX-');
    } else if (check.name === 'AUTH_SECRET') {
      console.log('   → Deve ter pelo menos 32 caracteres');
    } else if (check.name === 'NEXTAUTH_URL') {
      console.log('   → Deve ser http://localhost:3000 para desenvolvimento');
    }
    allPassed = false;
  } else {
    const masked = check.name.includes('SECRET') || check.name.includes('SECRET')
      ? `${check.value.substring(0, 10)}...`
      : check.value;
    console.log(`✅ ${check.name}: ${masked}`);
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ Todas as configurações estão corretas!');
  console.log('\n📋 Verificação de Redirect URI:');
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const redirectUri = `${nextAuthUrl}/api/auth/callback/google`;
  console.log(`\n   Configure no Google Console:\n`);
  console.log(`   Authorized JavaScript origins:`);
  console.log(`   ┌─────────────────────────────────┐`);
  console.log(`   │ ${nextAuthUrl.padEnd(31)} │`);
  console.log(`   └─────────────────────────────────┘\n`);
  console.log(`   Authorized redirect URIs:`);
  console.log(`   ┌──────────────────────────────────────────────────────┐`);
  console.log(`   │ ${redirectUri.padEnd(54)} │`);
  console.log(`   └──────────────────────────────────────────────────────┘\n`);
} else {
  console.log('❌ Algumas configurações estão faltando ou inválidas.');
  console.log('\n📖 Consulte:');
  console.log('   - CONFIGURACAO_ENV.md para configurar o .env');
  console.log('   - GUIA_GOOGLE_OAUTH.md para configurar o Google OAuth');
  process.exit(1);
}
