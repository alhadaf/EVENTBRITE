@@ .. @@
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Scanner Interface */}
-        <div className="bg-white rounded-lg border border-gray-200 p-6">
+        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Scanner</h3>
           
-          <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
+          <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 w-full" style={{ aspectRatio: '4/3' }}>
             {isActive ? (
               <video
                 ref={videoRef}
                 autoPlay
                 muted
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <div className="text-center">
                   <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-400">Camera is off</p>
                   <p className="text-sm text-gray-500 mt-2">Click "Start Scanner" to begin</p>
                 </div>
               </div>
             )}
             
             {isActive && (
               <div className="absolute inset-0 flex items-center justify-center">
-                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
+                <div className="w-32 h-32 sm:w-48 sm:h-48 border-2 border-white rounded-lg relative">
                   <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
                   <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
                   <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
                   <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br"></div>
                 </div>
               </div>
             )}
           </div>

           <button
             onClick={mockScan}
-            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
+            className="w-full bg-blue-600 text-white py-2 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base"
             disabled={!isActive}
           >
             Simulate QR Scan (Demo)
           </button>
         </div>

         {/* Manual Entry & Results */}
         <div className="space-y-6">
           {/* Manual Entry */}
-          <div className="bg-white rounded-lg border border-gray-200 p-6">
+          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   QR Code or Attendee ID
                 </label>
                 <input
                   type="text"
                   value={manualCode}
                   onChange={(e) => setManualCode(e.target.value)}
                   placeholder="Enter QR code or attendee ID"
                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
               <button
                 onClick={handleManualScan}
-                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
+                className="w-full bg-gray-600 text-white py-2 lg:py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm lg:text-base"
               >
                 Manual Check-in
               </button>
             </div>
           </div>

           {/* Last Scan Result */}
           {lastScanResult && (
-            <div className="bg-white rounded-lg border border-gray-200 p-6">
+            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Scan Result</h3>
               <div className={`p-4 rounded-lg ${
                 lastScanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
               }`}>
                 <div className="flex items-center space-x-3">
                   {lastScanResult.success ? (
                     <CheckCircle className="w-6 h-6 text-green-600" />
                   ) : (
                     <XCircle className="w-6 h-6 text-red-600" />
                   )}
                   <div>
                     <p className={`font-medium ${
                       lastScanResult.success ? 'text-green-800' : 'text-red-800'
                     }`}>
                       {lastScanResult.message}
                     </p>
                     {lastScanResult.attendeeName && (
                       <p className="text-sm text-gray-600 mt-1">
                         Attendee: {lastScanResult.attendeeName}
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Sample QR Code */}
-          <div className="bg-white rounded-lg border border-gray-200 p-6">
+          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample QR Code</h3>
             <div className="flex justify-center">
               <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
-                <QRCode value="ATT-001-EVENT-123" size={120} />
+                <QRCode value="ATT-001-EVENT-123" size={100} />
               </div>
             </div>
             <p className="text-sm text-gray-500 text-center mt-2">ATT-001-EVENT-123</p>
           </div>
         </div>
       </div>