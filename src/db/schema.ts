import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

// Every row is sync-ready: UUID key, created/updated timestamps and soft delete.
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
};

// No default: callers pass newId() (expo-crypto can't load in drizzle-kit's Node context).
const id = text('id').primaryKey();

export const currencies = sqliteTable('currencies', {
  id,
  code: text('code').notNull().unique(), // ISO 4217, e.g. HUF
  decimals: integer('decimals').notNull(), // minor-unit digits: HUF 0, EUR 2
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const categories = sqliteTable('categories', {
  id,
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const tags = sqliteTable(
  'tags',
  {
    id,
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (t) => [index('tags_category_idx').on(t.categoryId)],
);

export const recurring = sqliteTable('recurring', {
  id,
  amount: integer('amount').notNull(), // minor units
  currency: text('currency').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id),
  tagIds: text('tag_ids', { mode: 'json' })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  description: text('description'),
  schedule: text('schedule', { enum: ['monthly', 'yearly'] }).notNull(),
  startDate: text('start_date').notNull(), // yyyy-MM-dd; day (and month) of recurrence
  nextDue: text('next_due').notNull(), // yyyy-MM-dd
  ...timestamps,
});

export const expenses = sqliteTable(
  'expenses',
  {
    id,
    amount: integer('amount').notNull(), // minor units
    currency: text('currency').notNull(),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    date: text('date').notNull(), // local calendar day, yyyy-MM-dd
    description: text('description'),
    recurringId: text('recurring_id').references(() => recurring.id),
    ...timestamps,
  },
  (t) => [index('expenses_currency_date_idx').on(t.currency, t.date)],
);

export const expenseTags = sqliteTable(
  'expense_tags',
  {
    expenseId: text('expense_id')
      .notNull()
      .references(() => expenses.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.expenseId, t.tagId] })],
);

export const budgets = sqliteTable(
  'budgets',
  {
    id,
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    currency: text('currency').notNull(),
    amount: integer('amount').notNull(), // monthly limit, minor units
    ...timestamps,
  },
  (t) => [uniqueIndex('budgets_category_currency_idx').on(t.categoryId, t.currency)],
);

export type Currency = typeof currencies.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Recurring = typeof recurring.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
