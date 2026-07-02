-- Enum types used by user-owned tables (docs/03-DATABASE.md)

create type installment_type as enum (
  'credit_card',
  'pay_later',
  'loan',
  'other'
);

create type installment_status as enum (
  'active',
  'paid',
  'paused'
);

create type wishlist_priority as enum (
  'low',
  'medium',
  'high'
);

create type wishlist_need_level as enum (
  'nice_to_have',
  'useful',
  'necessary'
);
