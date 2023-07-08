import { NextFunction, Request, Response } from "express";
import { Transaction, TransactionDocument } from "../../transaction/model/transaction.model";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { TransactionType, TrasactionTimePeriod } from "../../../enums";
import { SpendFrequencyI } from "./response/analytics.response";

export const spendFrequencyService = async (req: Request, res: Response, next: NextFunction): Promise<SpendFrequencyI> => {
  const { orderBy } = req.query;
  const validOrderByKeys: string[] = ["today", "week", "month", "year"];
  const isOrderByValid: boolean = validOrderByKeys.includes(String(orderBy).toLowerCase());

  const expense: number[] = [];
  const expenseLabel: (string | number)[] = [];

  const today: Date = new Date();
  const month: string = (today.getMonth() + 1).toString().padStart(2, "0");
  const year: number = today.getFullYear();
  const day: string = today.getDate().toString().padStart(2, "0");

  //for today's expense data
  const todayDateString: Date = new Date(`${year}-${month}-${day}T00:00:00.1+00:00`);

  //for weekly expense data
  const startOfWeek: Date = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek: Date = new Date(today.setDate(today.getDate() + 7));

  //for monthly expense data
  const startOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  //for year expense data
  const startOfYear: Date = new Date(year, 0, 1);
  const endOfYear: Date = new Date(year + 1, 0, 1);

  if (!isOrderByValid) {
    throw new AppError(HttpStatusCode.BadRequest, "Kindly select a valid time!");
  }

  switch (orderBy) {
    case TrasactionTimePeriod.TODAY: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.EXPENSE,
        createdAt: {
          $gte: new Date(todayDateString),
          $lt: new Date(Date.now()),
        },
      });

      let totalExpense: number = 0;
      let expensesDate: any = [];

      for (const transaction of transactions) {
        const { amount, createdAt } = transaction;

        const year: number = createdAt.getFullYear();
        const month: number = createdAt.getMonth() + 1;
        const day: number = createdAt.getDate();
        const formattedDate: string = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        expensesDate.push(formattedDate);

        totalExpense += amount;
      }
      expense.push(totalExpense);
      expenseLabel.push(expensesDate[0]);

      break;
    }

    case TrasactionTimePeriod.WEEK: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.EXPENSE,
        createdAt: {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      });

      const weeklyExpenses: { [dayName: string]: number } = {};

      for (const transaction of transactions) {
        const { amount, createdAt } = transaction;
        const dayName = createdAt.toLocaleDateString("en-US", { weekday: "long" });

        if (!weeklyExpenses[dayName]) {
          weeklyExpenses[dayName] = amount;
        } else {
          weeklyExpenses[dayName] += amount;
        }
      }

      for (const dayName in weeklyExpenses) {
        expense.push(weeklyExpenses[dayName]);
        expenseLabel.push(dayName);
      }

      break;
    }

    case TrasactionTimePeriod.MONTH: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.EXPENSE,
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });

      const weeklyExpenses: number[] = [];
      const weeklyLabels: string[] = [];

      for (const transaction of transactions) {
        const { amount, createdAt } = transaction;
        const week = Math.ceil(createdAt.getDate() / 7);

        if (!weeklyExpenses[week]) {
          weeklyExpenses[week] = amount;
        } else {
          weeklyExpenses[week] += amount;
        }
      }

      for (let week = 1; week <= weeklyExpenses.length; week++) {
        const amount = weeklyExpenses[week] || 0;
        const label = `Week ${week}`;

        weeklyLabels.push(label);
        expense.push(amount);
        expenseLabel.push(label);
      }

      break;
    }

    case TrasactionTimePeriod.YEAR: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.EXPENSE,
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
      });
      const monthlyAmounts: { [month: number]: number } = {};

      for (const transaction of transactions) {
        const { amount, createdAt } = transaction;

        const month: number = createdAt.getMonth() + 1;

        if (!monthlyAmounts[month]) {
          monthlyAmounts[month] = amount;
        } else {
          monthlyAmounts[month] += amount;
        }
      }

      for (let month = 1; month <= 12; month++) {
        expense.push(monthlyAmounts[month] || 0);
        expenseLabel.push(month);
      }

      break;
    }
  }

  const result = {
    data: expense,
    label: expenseLabel,
  };

  return result;
};

export const financialReportService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { startingDate, endingDate } = req.body;
  const { type } = req.query;
  const transactionsInDB = [];
  let sum = 0;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || limit <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const hasPrevious = startIndex > 0 ? true : false;
  const hasNext = endIndex < (await Transaction.find({ owner: req.user._id }).countDocuments().exec()) ? true : false;

  switch (type) {
    case TransactionType.INCOME: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.INCOME,
        createdAt: {
          $gte: startingDate,
          $lt: endingDate,
        },
      })
        .sort("-createdAt")
        .limit(limit)
        .skip(startIndex)
        .populate("category")
        .populate({
          path: "wallet",
          select: ["_id", "amount", "name"],
        })
        .populate("attachments")
        .select(["-owner"])
        .exec();
      transactionsInDB.push(transactions);
      sum = transactions.reduce((total, transaction) => total + transaction.amount, 0);

      break;
    }

    case TransactionType.EXPENSE: {
      const transactions: TransactionDocument[] = await Transaction.find({
        owner: req.user._id,
        type: TransactionType.EXPENSE,
        createdAt: {
          $gte: startingDate,
          $lt: endingDate,
        },
      })
        .sort("-createdAt")
        .limit(limit)
        .skip(startIndex)
        .populate("category")
        .populate({
          path: "wallet",
          select: ["_id", "amount", "name"],
        })
        .populate("attachments")
        .select(["-owner"])
        .exec();

      transactionsInDB.push(transactions);
      sum = transactionsInDB[0].reduce((total, transaction) => total + transaction.amount, 0);
      break;
    }
  }

  const result = {
    data: transactionsInDB[0],
    totalAmount: sum,
    pagination: {
      page: page,
      perPage: limit,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
  };
  return result;
};
