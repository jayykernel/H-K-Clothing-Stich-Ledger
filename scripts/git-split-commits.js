#!/usr/bin/env node

/**
 * git-split-commits.js
 * Splits uncommitted git changes into N meaningful commits
 *
 * Usage: node scripts/git-split-commits.js <number-of-commits> [message-prefix]
 *
 * Example:
 *   node scripts/git-split-commits.js 3
 *   node scripts/git-split-commits.js 2 "costing module"
 */

const { execSync } = require('child_process');

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getAllChangedFiles() {
  // Modified tracked files
  const modified = run('git diff --name-only').split('\n').filter(Boolean);
  // Staged files
  const staged = run('git diff --cached --name-only').split('\n').filter(Boolean);
  // Untracked new files
  const untracked = run('git ls-files --others --exclude-standard').split('\n').filter(Boolean);
  // Deduplicate
  return [...new Set([...modified, ...staged, ...untracked])];
}

function groupFiles(files, numCommits) {
  const categories = {
    docs: { pattern: f => f.match(/\.(md|txt|doc)$/i) || f.startsWith('docs/') || f.toLowerCase().includes('readme'), label: 'docs' },
    config: { pattern: f => f.match(/\.(json|yml|yaml|toml|env|gitignore)$/) || f.startsWith('.claude/') || f.startsWith('.github/'), label: 'config' },
    scripts: { pattern: f => f.startsWith('scripts/'), label: 'scripts' },
    backend: { pattern: f => f.startsWith('backend/') || f.startsWith('prisma/') || f.startsWith('server/'), label: 'backend' },
    frontend: { pattern: f => f.startsWith('apps/web/') || f.startsWith('src/') || f.startsWith('packages/ui'), label: 'frontend' },
    mobile: { pattern: f => f.startsWith('apps/mobile/') || f.startsWith('mobile/'), label: 'mobile' },
    shared: { pattern: f => f.startsWith('packages/'), label: 'shared' },
    tests: { pattern: f => f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__'), label: 'tests' },
  };

  const groups = [];
  const assigned = new Set();

  // Assign files to categories
  for (const [key, cat] of Object.entries(categories)) {
    const matched = files.filter(f => !assigned.has(f) && cat.pattern(f));
    if (matched.length > 0) {
      groups.push({ name: cat.label, files: matched });
      matched.forEach(f => assigned.add(f));
    }
  }

  // Remaining uncategorized files
  const remaining = files.filter(f => !assigned.has(f));
  if (remaining.length > 0) {
    groups.push({ name: 'misc', files: remaining });
  }

  // Merge groups if we have more than numCommits
  while (groups.length > numCommits && groups.length > 1) {
    // Merge the two smallest groups
    groups.sort((a, b) => a.files.length - b.files.length);
    const smallest = groups.shift();
    groups[0].files = [...smallest.files, ...groups[0].files];
    groups[0].name = `${groups[0].name} & ${smallest.name}`;
  }

  // Split largest group if we have fewer than numCommits
  while (groups.length < numCommits && groups.some(g => g.files.length > 1)) {
    groups.sort((a, b) => b.files.length - a.files.length);
    const largest = groups[0];
    if (largest.files.length <= 1) break;
    const mid = Math.ceil(largest.files.length / 2);
    const split1 = largest.files.slice(0, mid);
    const split2 = largest.files.slice(mid);
    groups[0] = { name: `${largest.name} (part 1)`, files: split1 };
    groups.splice(1, 0, { name: `${largest.name} (part 2)`, files: split2 });
  }

  return groups;
}

function generateMessage(groupName, files, prefix) {
  const typeMap = {
    docs: 'docs',
    config: 'chore',
    scripts: 'chore',
    backend: 'feat',
    frontend: 'feat',
    mobile: 'feat',
    shared: 'feat',
    tests: 'test',
    misc: 'chore',
  };

  // Find the base category (before any merging labels)
  const baseName = groupName.split(' & ')[0].split(' (')[0].trim();
  const type = typeMap[baseName] || 'chore';

  // Build a descriptive message from the files
  const extensions = [...new Set(files.map(f => f.split('.').pop()))];
  const dirs = [...new Set(files.map(f => f.split('/')[0]))];

  let description = '';
  if (prefix) {
    description = `${type}: ${prefix} - ${groupName}`;
  } else {
    description = `${type}: add ${groupName} files`;
    if (files.length === 1) {
      description = `${type}: add ${files[0]}`;
    }
  }

  // Build bullet list of files for commit body
  const body = files.map(f => `- ${f}`).join('\\n');

  return { subject: description, body };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
git-split-commits

Splits uncommitted git changes into N meaningful commits.

Usage:
  node scripts/git-split-commits.js <number-of-commits> [message-prefix]

Flags:
  --dry-run   Preview commits without making changes
  --push      Push to origin/main after committing
  --help      Show this help

Examples:
  node scripts/git-split-commits.js 3
  node scripts/git-split-commits.js 2 "costing module"
  node scripts/git-split-commits.js 3 --dry-run
  node scripts/git-split-commits.js 3 --push
`);
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const shouldPush = args.includes('--push');
  const cleanArgs = args.filter(a => !a.startsWith('--'));
  const numCommits = parseInt(cleanArgs[0]) || 3;
  const prefix = cleanArgs[1] || '';

  console.log('\n=== Git Split Commits ===\n');

  const allFiles = getAllChangedFiles();

  if (allFiles.length === 0) {
    console.log('No uncommitted changes found.');
    process.exit(0);
  }

  console.log(`Found ${allFiles.length} uncommitted file(s):`);
  allFiles.forEach(f => console.log(`  ${f}`));
  console.log('');

  const groups = groupFiles(allFiles, numCommits);

  console.log(`Proposed ${groups.length} commit(s):\n`);
  groups.forEach((group, i) => {
    const msg = generateMessage(group.name, group.files, prefix);
    console.log(`  Commit ${i + 1}: ${msg.subject}`);
    group.files.forEach(f => console.log(`    - ${f}`));
    console.log('');
  });

  if (dryRun) {
    console.log('-- Dry run complete. No changes made. --\n');
    process.exit(0);
  }

  // Execute commits
  console.log('Creating commits...\n');

  let success = 0;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const msg = generateMessage(group.name, group.files, prefix);

    try {
      // Quote each file path individually
      const filePaths = group.files.map(f => `"${f}"`).join(' ');
      execSync(`git add ${filePaths}`, { encoding: 'utf8' });
      execSync(`git commit -m "${msg.subject}"`, { encoding: 'utf8' });
      console.log(`  [${i + 1}/${groups.length}] ✓ ${msg.subject}`);
      success++;
    } catch (err) {
      console.log(`  [${i + 1}/${groups.length}] ✗ Failed: ${err.message.split('\n')[0]}`);
    }
  }

  console.log(`\n${success}/${groups.length} commits created.\n`);

  // Show log
  console.log('Recent commits:');
  console.log(run('git log --oneline -10'));
  console.log('');

  if (shouldPush) {
    console.log('Pushing to origin/main...');
    try {
      execSync('git push origin main', { encoding: 'utf8' });
      console.log('✓ Pushed successfully!\n');
    } catch (err) {
      console.log('✗ Push failed. Run manually: git push origin main\n');
    }
  } else {
    console.log('Run "git push origin main" to push these commits.\n');
  }
}

main();