import fs from 'node:fs';

const fileName = 'expenses_export.csv';
const renamedFile = 'expenses_backup.csv';

try {
  // Write initial expense data
  fs.writeFileSync(fileName,
    'Date,Title,Amount,Category,PaymentMethod\n');
  console.log('Expense file created successfully');

  // Read file content
  let data = fs.readFileSync(fileName, 'utf8');
  console.log('Reading file content:');
  console.log(data);

  // Append more expense records
  fs.appendFileSync(fileName,
    '2025-01-15,Lunch,250,Food,Cash\n');
  fs.appendFileSync(fileName,
    '2025-01-16,Electricity Bill,1200,Bills,Online\n');
  console.log('Expense records appended successfully');

  // Read updated content
  data = fs.readFileSync(fileName, 'utf8');
  console.log('Updated expense file:');
  console.log(data);

  // Rename the file
  fs.renameSync(fileName, renamedFile);
  console.log('File renamed to: ' + renamedFile);

  // Delete the file
  fs.unlinkSync(renamedFile);
  console.log('File deleted successfully');

} catch (error) {
  console.error('File operation error:', error.message);
}
