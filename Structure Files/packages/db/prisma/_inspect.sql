SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('appointments', 'doctor_chambers')
  AND column_name IN ('hospital_id', 'department_id', 'chamber_id')
ORDER BY table_name, column_name;

SELECT a.id, a.chamber_id, a.appointment_number
FROM appointments a
LIMIT 20;
