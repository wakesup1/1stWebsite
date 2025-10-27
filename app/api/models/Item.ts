import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for Transaction document
 */
export interface ITransaction extends Document {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema definition for Transaction
 * Stores income and expense records with category and description
 */
const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
TransactionSchema.index({ type: 1, date: -1 });
TransactionSchema.index({ category: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);