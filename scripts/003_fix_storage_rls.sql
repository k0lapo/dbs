-- Enable public image uploads to product-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);

-- Allow public to read product images
CREATE POLICY "Allow public to read product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to update their own product images
CREATE POLICY "Allow authenticated users to update product images"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);
