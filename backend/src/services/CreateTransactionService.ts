import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // instanciando repositorio
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    // Verificar se categoria ja existe
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!transactionCategory) {
      // Não existe? Criar categoria
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }
    // criar nova transação
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // salvando no bd
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
