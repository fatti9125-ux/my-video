import Foundation
import Vision
import CoreImage
import AppKit
// usage: subject_mask <in> <outPrefix>   -> writes <outPrefix>_inst<N>.png masks (white=subject) and _all.png
let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1]); let prefix = args[2]
let handler = VNImageRequestHandler(url: url)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject"); exit(1) }
print("instances:", obs.allInstances.map{$0})
let ctx = CIContext()
func save(_ pb: CVPixelBuffer, _ path: String) {
  let ci = CIImage(cvPixelBuffer: pb)
  let cg = ctx.createCGImage(ci, from: ci.extent)!
  let rep = NSBitmapImageRep(cgImage: cg)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}
for i in obs.allInstances {
  let m = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler)
  save(m, "\(prefix)_inst\(i).png")
}
let all = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
save(all, "\(prefix)_all.png")
