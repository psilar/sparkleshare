#!/usr/bin/env python

import re
import csv
import string

fields = ['guid', 'name', 'summary', 'description', 'address', 'street', 'additional', 'city', 'county', 'country', 'email', 'phone', 'website', 'services', 'activities']
services = ['Retail/Gear Sales', 'Equipment Rental', 'Tour Operator', 'School/Lessons/Activities', 'Accommodation', 'Kids Camps/Summer Camps', 'Information Service']

def titlecase(s):
  return re.sub(r"[A-Za-z]+('[A-Za-z]+)?", lambda mo: mo.group(0)[0].upper() + mo.group(0)[1:].lower(), s)


infile = open('hackable-bp.csv', 'rb')
outfile = open('bp-hack-result.csv', 'wb')

dialect = csv.Sniffer().sniff(infile.read(1024))
infile.seek(0)
dialect.quoting = csv.QUOTE_ALL
dialect.quotechar = '"'
dialect.delimiter = ';'
dialect.doublequote = False
dialect.escapechar = ' '

dictreader = csv.DictReader(infile, delimiter=';')
dictwriter = csv.DictWriter(outfile, fieldnames=fields, extrasaction='ignore', dialect=dialect)


# read and write header fields
header = dictreader.next()
for key in fields:
  header[key] = key
dictwriter.writerow(header)

count = 0
newrow = {}
quote = dialect.quotechar
try:
  while(1):
    count = count + 1
    row = dictreader.next()

    for key in fields:
      newrow[key] = row[key]
      
    munged_address = titlecase(row['street'] + ', ' + row['additional'] + ', ' + row['city'] + ', Co. ' + row['county'] + ', ' + row['country']).strip()
    newrow['address'] = string.replace(munged_address, ' ,', '').lstrip(', ')
    if ',' in newrow['street']:
      street = newrow['street']
      newrow['additional'] = street[string.find(street, ',')+1:].strip()
      newrow['street'] = street[0:string.find(street, ',')].strip()
    message = 'Is this your business?  Setup your FREE account now and contact support@gnarlyadventure.com to update it.'
    newrow['summary'] = message
    newrow['description'] = message

    for key in row:
      if key in fields:
        continue;
      if row[key].strip() != '':
        if key in services:
          if newrow['services'] == '':
            #newrow['services'] = '"' + key + '"'
            newrow['services'] = key
          else:
            #newrow['services'] = newrow['services'] + ', "' + key + '"'
            newrow['services'] = newrow['services'] + quote + ', ' + quote + key
            #newrow['services'] = newrow['services'] + ', ' + key
        else:
          if newrow['activities'] == '':
            #newrow['activities'] = '"' + key + '"'
            #newrow['activities'] = key + '"'
            newrow['activities'] = key
          else:
            #newrow['activities'] = newrow['activities'] + ', ' + '"' + key + '"'
            newrow['activities'] = newrow['activities'] + quote + ', ' + quote + key
            #newrow['activities'] = newrow['activities'] + ', ' + key

    dictwriter.writerow(newrow)
    if count >= 5 and False:
      raise StopIteration
except StopIteration:
  pass

