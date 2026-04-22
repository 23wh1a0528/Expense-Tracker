export const validateExpense = (req, res, next) => {
  const { title, amount, category, date } = req.body;
  if (!title || !title.trim())
    return res.status(400).json({ message: 'Title is required' });
  if (!amount || isNaN(amount) || Number(amount) <= 0)
    return res.status(400).json({ message: 'Amount must be a positive number' });
  if (!category)
    return res.status(400).json({ message: 'Category is required' });
  if (!date)
    return res.status(400).json({ message: 'Date is required' });
  next();
};