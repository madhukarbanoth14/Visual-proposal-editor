#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0

pass() { echo "✓ $1"; PASS=$((PASS + 1)); }
fail() { echo "✗ $1"; FAIL=$((FAIL + 1)); }

echo "Testing Proposal Builder at $BASE_URL"
echo "========================================"

# Health: dashboard API
STATUS=$(curl -s -o /tmp/dashboard.json -w "%{http_code}" "$BASE_URL/api/dashboard")
if [ "$STATUS" = "200" ]; then
  TOTAL=$(python3 -c "import json; print(json.load(open('/tmp/dashboard.json'))['total'])" 2>/dev/null || echo 0)
  pass "Dashboard API (total=$TOTAL)"
else
  fail "Dashboard API returned $STATUS"
fi

# Quotations list
STATUS=$(curl -s -o /tmp/quotations.json -w "%{http_code}" "$BASE_URL/api/quotations")
if [ "$STATUS" = "200" ]; then
  pass "Quotations API"
else
  fail "Quotations API returned $STATUS"
fi

# Get first quotation ID
QID=$(python3 -c "import json; d=json.load(open('/tmp/quotations.json')); print(d[0]['id'] if d else '')" 2>/dev/null || echo "")

if [ -n "$QID" ]; then
  # Single quotation
  STATUS=$(curl -s -o /tmp/quotation.json -w "%{http_code}" "$BASE_URL/api/quotations/$QID")
  if [ "$STATUS" = "200" ]; then
    pass "Get quotation by ID"
  else
    fail "Get quotation returned $STATUS"
  fi

  # PDF generation
  STATUS=$(curl -s -o /tmp/proposal.pdf -w "%{http_code}" "$BASE_URL/api/quotations/$QID/pdf")
  if [ "$STATUS" = "200" ] && file /tmp/proposal.pdf | grep -q PDF; then
    pass "PDF generation"
  else
    fail "PDF generation failed ($STATUS)"
  fi

  # Payment schedule totals 100%
  python3 << 'PY'
import json
q = json.load(open("/tmp/quotation.json"))
schedule = q["data"]["paymentSchedule"]
total_pct = sum(m["percentage"] for m in schedule)
total = q["pricing"]["total"]
amounts = [m["amount"] for m in schedule]
print(f"  Payment %: {total_pct}, Total: {total}, Amounts: {amounts}")
if total_pct != 100:
    exit(1)
PY
  if [ $? -eq 0 ]; then pass "Payment schedule totals 100%"; else fail "Payment schedule invalid"; fi

  # Client view page
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/quotations/$QID/client-view")
  if [ "$STATUS" = "200" ]; then pass "Client view page"; else fail "Client view returned $STATUS"; fi

  # Edit page
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/quotations/$QID/edit")
  if [ "$STATUS" = "200" ]; then pass "Builder edit page"; else fail "Edit page returned $STATUS"; fi
else
  fail "No quotation found for further tests"
fi

# Libraries
for ep in services deliverables albums terms; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/$ep")
  if [ "$STATUS" = "200" ]; then pass "API /$ep"; else fail "API /$ep returned $STATUS"; fi
done

# Brand settings
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/settings/branding")
if [ "$STATUS" = "200" ]; then pass "Brand settings API"; else fail "Brand settings returned $STATUS"; fi

# Static pages
for page in dashboard quotations templates services deliverables albums settings/branding settings/terms; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$page")
  if [ "$STATUS" = "200" ]; then pass "Page /$page"; else fail "Page /$page returned $STATUS"; fi
done

# Create new quotation
STATUS=$(curl -s -o /tmp/new-q.json -w "%{http_code}" -X POST "$BASE_URL/api/quotations" -H "Content-Type: application/json" -d '{"sample":false}')
if [ "$STATUS" = "201" ]; then
  pass "Create empty quotation"
  NEW_ID=$(python3 -c "import json; print(json.load(open('/tmp/new-q.json'))['id'])")
  curl -s -o /dev/null -X DELETE "$BASE_URL/api/quotations/$NEW_ID"
  pass "Delete quotation"
else
  fail "Create quotation returned $STATUS"
fi

echo "========================================"
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
