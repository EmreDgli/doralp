"use client";

import { useState } from 'react';

export default function TestStoragePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStorage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-storage');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Connection test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const testBuckets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-buckets');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Buckets test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const testSimpleUpload = async () => {
    setLoading(true);
    try {
      // Basit bir test dosyası oluştur
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', testFile);
      
      const response = await fetch('/api/simple-upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Simple upload test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const createBucket = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-bucket', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Bucket creation failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const deleteBucket = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/delete-bucket', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Bucket deletion failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-database');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Database check failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const checkMachinesTable = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-machines-table');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Machines table check failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Storage Test</h1>
      
      <div className="space-x-4">
        <button
          onClick={testStorage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Storage'}
        </button>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testBuckets}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Buckets'}
        </button>
        
        <button
          onClick={testSimpleUpload}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Simple Upload'}
        </button>
        
        <button
          onClick={createBucket}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Bucket'}
        </button>
        
        <button
          onClick={deleteBucket}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          {loading ? 'Deleting...' : 'Delete Bucket'}
        </button>
        
        <button
          onClick={checkDatabase}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Database'}
        </button>
        
        <button
          onClick={checkMachinesTable}
          disabled={loading}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Machines Table'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Test Result:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 