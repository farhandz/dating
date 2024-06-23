import { Pool } from 'pg';
import { pgConnection } from '../../database';
const db = new Pool(pgConnection);

export const charterBuilder = async () => {
  const queryShow = {
    text: `
          SELECT charters.id, charters.name, charters.updated_at,
          charters.code,
          charters.planed_start_at, charters.planed_end_at, charters.deleted_at,
          crs.name as project_status ,
          crs.code as project_status_code,  
          cs.name as segment_name,
          cu.name as unit,
          cds.name as delivery_name,
          cds.code as delivery_code,
          csy.name as symptom_name,
          charters.tenant_id,
          charters.value_category,
          vc.name as value_category_name,
          charters.budget_allocated as budget_plan,
          charters.budget_spent as budget_real,
          charters.budget_gap,
          charters.progress,
          charters.value as project_value,
          monitoring_at FROM charters
          LEFT JOIN charter_running_statuses crs
          on crs.code = charters.charter_running_status_code
          LEFT JOIN charter_segments cs 
          on cs.code = charters.charter_segment_code
          LEFT JOIN charter_units cu on cu.code = charters.charter_unit_code
          LEFT JOIN charter_value_categories vc on vc.code = charters.value_category
          LEFT JOIN charter_delivery_statuses cds on cds.code = charters.charter_delivery_status_code
          LEFT JOIN charter_symptoms  csy  on csy.code = charters.charter_symptom_code
          WHERE charters.deleted_at is null
        `,
  };

  return (await db.query(queryShow)).rows;
};

export const orginisationBuilder = async () => {
  const queryShow = {
    text: `
          SELECT co.id, co.charter_code, 
          cd.name as division_name,
          cdt.name as directorat_name,
          cr.name as regional_name
          FROM charter_organizations co 
          LEFT JOIN charter_divisions cd
          on cd.code = co.charter_division_code
          LEFT JOIN charter_directorats cdt 
          on cdt.code = co.charter_division_code
          LEFT JOIN charter_regionals cr
          on cr.code = co.charter_regional_code
        `,
  };

  return (await db.query(queryShow)).rows;
};

export const stakeholderBuilder = async () => {
  const queryShow = {
    text: `
          SELECT c.name as charter_name, cs.stackholder_code as stackholder_code , 
          s.name as stackholder_name , st.name as stackholder_type ,
          cs.charter_code as charter_code
          FROM charter_stackholders cs
          LEFT JOIN charters c on c.code = cs.charter_code
          LEFT JOIN stackholders s on s.code = cs.stackholder_code
          LEFT JOIN stackholder_types st on st.code = s.stackholder_type_code
        `,
  };

  return (await db.query(queryShow)).rows;
};

export const contractBuilder = async () => {
  const queryShow = {
    text: `
          SELECT p.partner_name, pp.charter_id, cf.category_name, cm.contract_no, 
          pp.value_total,
          pp.top_type FROM partner_payments pp 
          LEFT JOIN contract_mitras cm on cm.partnerpayment_id = pp.id
          LEFT JOIN partners p on p.code = pp.partner_code LEFT JOIN category_file 
          cf ON cf.id = cm.category_file_id
        `,
  };

  return (await db.query(queryShow)).rows;
};

export const riskBuilder = async () => {
  const queryShow = {
    text: `
          SELECT rs.name as register_name, rc.name as category , rsp.name as action_plan , 
          u.name as pic , rs.deleted_at, rs.charter_id FROM risk_registers rs 
          LEFT JOIN risk_categories rc on rc.code = rs.risk_category_code
          LEFT JOIN risk_response_plans rsp on rsp.risk_register_code = rs.code 
          LEFT JOIN users u on u.id = rsp.assigned_to where rs.deleted_at is null
        `,
  };

  return (await db.query(queryShow)).rows;
};

export const deliverableBuilder = async (offset, batchSize) => {
  const queryShow = {
    text: `
        SELECT t.id, t.charter_id, t.text, t.progress as total_progress, 
        t.created_at, t.start_date, t.end_date,  t.status, 
        t.type as task_type,
        t.order_num,
        (t.bobot/100 * tpw.value) as progress,
        tpw.type as progress_type,
        tpw.end_date progress_end_date,
        tpw.start_date progress_start_date,
        tpw.duration progress_duration,
        tpw.value_sum as progress_value_sum,
        tpw.value as progress_value
        FROM tasks t 
        LEFT JOIN task_progress_weights tpw ON tpw.task_id = t.id
        WHERE t.type = 'task'
        OFFSET $1
        LIMIT $2
    `,
    values: [offset, batchSize],
  };

  const result = await db.query(queryShow);
  return result.rows;
};

export const deliverableBuilder2 = async () => {
  const queryShow = {
    text: `
        SELECT t.id, t.charter_id, t.text, t.progress as total_progress, 
        t.created_at, t.start_date, t.end_date,  t.status, 
        t.type as task_type,
        tpw.type as progress_type,
        tpw.end_date progress_end_date,
        tpw.end_date progress_end_date
        FROM tasks t 
        LEFT JOIN task_progress_weights tpw ON tpw.task_id = t.id
        WHERE t.type = 'task'
    `,
  };

  const result = await db.query(queryShow);
  return result.rows;
};

export const getTotalRowCount = async () => {
  const queryCount = {
    text: `
          SELECT COUNT(*) AS total_rows 
          FROM tasks t LEFT JOIN task_progress_weights tpw ON tpw.task_id = t.id where t.type = 'task'
      `,
  };

  const result = await db.query(queryCount);
  return result.rows[0].total_rows;
};

export const TermOfPaymentBuilder = async () => {
  const queryShow = {
    text: `
    SELECT top.id, top.charter_id, 
    top.partner_payment_code,
    pt.top_type,
    p.partner_name,
    top.top_status,
    top.value,
    pty.name as pay_type
    FROM term_of_payments AS top
    LEFT JOIN partner_payments pt
    ON pt.code = top.partner_payment_code
    LEFT JOIN partners p on p.code = pt.partner_code
    LEFT JOIN pay_types pty on pty.code = pt.pay_type_code
    WHERE top.deleted_at is null
    `,
  };

  const result = await db.query(queryShow);
  return result.rows;
};

export const TermOfPaymentBuilderTelpro = async () => {
  const queryShow = {
    text: `
    
    -- Query to fetch both real and plan values for each id
SELECT 
  top.id, 
  top.charter_id, 
  to_char(top.due_date, 'MM-DD-YYYY') AS selected_date,
  NULLIF(CAST(top.value AS VARCHAR), 'NaN') AS value,
  pt.top_type,
  p.partner_name,
  top.top_status,
  'plan' AS type,
  pty.name AS pay_type
FROM 
  term_of_payments AS top
JOIN 
  partner_payments pt ON pt.code = top.partner_payment_code
JOIN 
  partners p ON p.code = pt.partner_code
JOIN 
  pay_types pty ON pty.code = pt.pay_type_code
WHERE 
  top.deleted_at IS null

UNION ALL

SELECT 
  top.id, 
  top.charter_id, 
 (SELECT CONCAT(SUBSTRING(attribute_value, 4, 3), SUBSTRING(attribute_value, 1, 3), SUBSTRING(attribute_value, 7, 4)) AS selected_date
 FROM partner_taxonomies
 WHERE attribute_key = 'date' AND topable_id = top.id),
  NULLIF(CAST(ptx.attribute_value AS VARCHAR), 'NaN') AS VALUE,
  pt.top_type,
  p.partner_name,
  top.top_status,
  'real' AS type,
  pty.name AS pay_type
FROM 
  partner_taxonomies ptx
JOIN 
  term_of_payments AS top ON ptx.topable_id = top.id
JOIN 
  partner_payments pt ON pt.code = top.partner_payment_code
JOIN 
  partners p ON p.code = pt.partner_code
JOIN 
  pay_types pty ON pty.code = pt.pay_type_code
WHERE 
  ptx.attribute_key = 'value' AND top.deleted_at is null;

    `,
  };

  const result = await db.query(queryShow);
  return result.rows;
};
