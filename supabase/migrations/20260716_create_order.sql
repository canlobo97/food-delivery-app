-- Aligns with:
--   products.id bigint, price integer, name/image text
--   orders.id uuid, status default 'in_elaborazione', items/customer jsonb
--
-- Run in Supabase SQL Editor.

create or replace function public.create_order(
  p_items jsonb,
  p_customer jsonb,
  p_asap boolean,
  p_delivery_time text default null,
  p_delivery_timestamp timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_item jsonb;
  v_product record;
  v_product_id bigint;
  v_qty integer;
  v_notes text;
  v_built_items jsonb := '[]'::jsonb;
  v_total numeric := 0;
  v_line numeric;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  if coalesce(trim(p_customer->>'name'), '') = ''
     or coalesce(trim(p_customer->>'address'), '') = ''
     or coalesce(trim(p_customer->>'phone'), '') = ''
     or coalesce(trim(p_customer->>'payment'), '') = '' then
    raise exception 'INVALID_CUSTOMER';
  end if;

  if not p_asap and coalesce(trim(p_delivery_time), '') = '' then
    raise exception 'SLOT_REQUIRED';
  end if;

  for v_item in
    select value from jsonb_array_elements(p_items)
  loop
    begin
      v_product_id := (v_item->>'id')::bigint;
    exception when others then
      raise exception 'INVALID_PRODUCT_ID';
    end;

    begin
      v_qty := (v_item->>'quantity')::integer;
    exception when others then
      raise exception 'INVALID_QUANTITY';
    end;

    if v_qty is null or v_qty < 1 then
      raise exception 'INVALID_QUANTITY';
    end if;

    select id, name, price, image
    into v_product
    from public.products
    where id = v_product_id;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND:%', v_product_id;
    end if;

    if v_product.price is null or v_product.price < 0 then
      raise exception 'INVALID_PRODUCT_PRICE:%', v_product_id;
    end if;

    v_notes := coalesce(v_item->>'notes', '');
    -- price is integer in products; total stored as numeric on orders
    v_line := (v_product.price::numeric) * v_qty;
    v_total := v_total + v_line;

    v_built_items := v_built_items || jsonb_build_array(
      jsonb_build_object(
        'id', v_product.id,
        'name', v_product.name,
        'price', v_product.price,
        'image', v_product.image,
        'quantity', v_qty,
        'notes', v_notes
      )
    );
  end loop;

  insert into public.orders (
    user_id,
    total,
    items,
    customer,
    status,
    asap,
    delivery_time,
    delivery_timestamp
  )
  values (
    v_user_id,
    v_total,
    v_built_items,
    p_customer,
    'in_elaborazione',
    p_asap,
    case
      when p_asap then 'Il prima possibile'
      else p_delivery_time
    end,
    p_delivery_timestamp
  )
  returning id into v_order_id;

  return jsonb_build_object(
    'id', v_order_id,
    'total', v_total
  );
end;
$$;

revoke all on function public.create_order(jsonb, jsonb, boolean, text, timestamptz) from public;
grant execute on function public.create_order(jsonb, jsonb, boolean, text, timestamptz) to authenticated;

-- Dopo che un ordine di test funziona, rafforza così:
-- revoke insert on public.orders from authenticated;
-- revoke insert on public.orders from anon;
