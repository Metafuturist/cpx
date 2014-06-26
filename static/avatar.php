<?php //Default avatar image generator
$letter = "?";
$md5="d1457b72c3fb323a2671125aef3eab5d";
if(isset($_GET['name']) && strlen($_GET['name']) >= 1){
	$letter =htmlspecialchars(mb_strtoupper(mb_substr($_GET['name'], 0, 1, 'UTF-8'), 'UTF-8'));
	$md5=md5($_GET['name']); //We'll use a MD5 hash as pseudo-random to position everything, this way every avatar is UNIQUE
}
header('Content-Type: image/svg+xml'); ?>
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="100%"
   height="100%"
   id="svg2"
   version="1.1"
   inkscape:version="0.48.2 r9819"
   sodipodi:docname="avatar.svg"
   viewBox="0 0 100 100"
   style="background:#<?php echo substr($md5,0,6); ?>">
  <defs
     id="defs4">
    <linearGradient
       id="linearGradient3934">
      <stop
         style="stop-color:#ffffff;stop-opacity:1;"
         offset="0"
         id="stop3936" />
      <stop
         style="stop-color:#000000;stop-opacity:1;"
         offset="1"
         id="stop3938" />
    </linearGradient>
    <radialGradient
       inkscape:collect="always"
       xlink:href="#linearGradient3934"
       id="radialGradient3946"
       cx="0.50000024"
       cy="0.25000015"
       fx="0.50000024"
       fy="0.25000015"
       r="50"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(3.1340008,3.1398972,-1.3955685,1.3929477,-0.71810866,-1.6681864)" />
    <filter
       id="filter5096"
       inkscape:label="Drop shadow"
       width="1.5"
       height="1.5"
       x="-.25"
       y="-.25">
      <feGaussianBlur
         id="feGaussianBlur5098"
         in="SourceAlpha"
         stdDeviation="5"
         result="blur" />
      <feColorMatrix
         id="feColorMatrix5100"
         result="bluralpha"
         type="matrix"
         values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 " />
      <feOffset
         id="feOffset5102"
         in="bluralpha"
         dx="0"
         dy="0"
         result="offsetBlur" />
      <feMerge
         id="feMerge5104">
        <feMergeNode
           id="feMergeNode5106"
           in="offsetBlur" />
        <feMergeNode
           id="feMergeNode5108"
           in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="4"
     inkscape:cx="77.106993"
     inkscape:cy="63.5"
     inkscape:document-units="px"
     inkscape:current-layer="layer4"
     showgrid="false"
     width="100px"
     inkscape:window-width="1326"
     inkscape:window-height="702"
     inkscape:window-x="70"
     inkscape:window-y="88"
     inkscape:window-maximized="0" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:groupmode="layer"
     id="background"
     inkscape:label="Background">
    <rect style="fill:url(#radialGradient3946); fill-opacity:1; stroke:none; opacity:0.4; fill-rule:nonzero"
       id="rect3932"
       width="100"
       height="100"
       x="0"
       y="8.8245383e-015" />
  </g>
  <g
     inkscape:label="Calque 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(<?php echo hexdec(substr($md5,6,2))/2.56-25; ?>,<?php echo hexdec(substr($md5,8,2))/2.56-999; ?>)"
     style="display:inline;">
    <path
       id="path3781"
       style="font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-indent:0;text-align:start;text-decoration:none;line-height:normal;letter-spacing:normal;word-spacing:normal;text-transform:none;direction:ltr;block-progression:tb;writing-mode:lr-tb;text-anchor:start;baseline-shift:baseline;color:#000000;fill:#ffffff;fill-opacity:0.58823529;stroke:none;stroke-width:4;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate;font-family:Sans;-inkscape-font-specification:Sans"
       d="m 69.184008,946.89597 c -15.207258,-0.27408 -30.250948,6.31421 -38.78125,20.25 -9.723101,15.88444 -6.93004,38.74493 10.125,48.68753 a 2.0020348,2.0020348 0 1 0 2,-3.4688 c -14.897831,-8.6849 -17.371414,-28.9893 -8.71875,-43.12498 12.360504,-20.19311 40.145569,-23.42781 59.375,-11.1875 14.299302,9.10208 23.051232,25.28389 24.031252,42.15628 a 2.0002,2.0002 0 1 0 3.96875,-0.25003 c -1.05094,-18.09334 -10.36108,-35.4259 -25.843752,-45.28125 -7.86394,-5.00572 -17.031895,-7.6168 -26.15625,-7.78125 z m -40.740492,61.68683 c -10.849353,0.4855 -21.070295,9.2861 -20.28125,20.875 0.538657,7.9114 7.11677,15.3678 15.6875,14.5313 2.806883,-0.274 5.443325,-1.5759 7.375,-3.5938 1.931675,-2.0179 3.141423,-4.8632 2.71875,-7.9687 -0.263935,-1.9392 -1.20151,-3.7455 -2.65625,-5.0625 -1.45474,-1.3171 -3.564274,-2.1366 -5.78125,-1.7188 a 2.0041461,2.0041461 0 1 0 0.75,3.9375 c 0.897129,-0.169 1.63523,0.1086 2.34375,0.75 0.70852,0.6415 1.245058,1.6703 1.375,2.625 0.246791,1.8133 -0.388205,3.3955 -1.625,4.6875 -1.236795,1.292 -3.099158,2.1987 -4.90625,2.375 -6.030558,0.5886 -10.880371,-4.9559 -11.28125,-10.8437 -0.618537,-9.0846 7.630909,-16.1997 16.4375,-16.5938 12.865962,-0.5757 22.803509,11.085 23.125,23.5313 0.432268,16.7348 -14.266139,29.8651 -30.5,30.8437 a 2.0039024,2.0039024 0 1 0 0.25,4 c 18.232157,-1.0991 34.743514,-15.8315 34.25,-34.9375 -0.374659,-14.5046 -11.940362,-28.124 -27.28125,-27.4375 z" />
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer3"
     inkscape:label="Calque 2">
    <path
       sodipodi:type="spiral"
       style="stroke:#ffffff;stroke-width:4;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:0.58823532;stroke-dasharray:none;display:inline;fill:none"
       id="path3785"
       sodipodi:cx="95"
       sodipodi:cy="33.75"
       sodipodi:expansion="2.9300001"
       sodipodi:revolution="4.1100001"
       sodipodi:radius="41.143803"
       sodipodi:argument="-28.499121"
       sodipodi:t0="0.59799999"
       d="m 103.04742,29.456952 c 3.74016,4.648198 2.16464,11.47709 -2.34536,14.981701 -6.147059,4.776737 -15.04005,2.670139 -19.54715,-3.302732 -5.985651,-7.932266 -3.241495,-19.266666 4.476934,-24.946757 10.027802,-7.3795885 24.211616,-3.882003 31.247886,5.888683 8.97118,12.457515 4.59496,29.929265 -7.55856,38.517541 C 94.076046,71.368351 72.847481,65.979022 62.49882,51.088361 55.266829,40.682267 53.88922,27.071949 58.249989,15.250022"
       transform="translate(<?php echo hexdec(substr($md5,10,2))/2.56 -100; ?>,<?php echo hexdec(substr($md5,12,2))/2.56-50; ?>)" />
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer2"
     inkscape:label="Calque"
     style="display:inline">
    <path
       sodipodi:type="spiral"
       style="stroke:#ffffff;stroke-width:2.24017190999999990;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:0.58823532;stroke-dasharray:none;fill:none;fill-opacity:1"
       id="path3783"
       sodipodi:cx="59.598999"
       sodipodi:cy="86.110405"
       sodipodi:expansion="2.9300001"
       sodipodi:revolution="4.1100001"
       sodipodi:radius="14.008471"
       sodipodi:argument="-17.062748"
       sodipodi:t0="0.59799999"
       d="m 59.446073,83.008718 c 1.974645,-0.476472 3.848594,1.000698 4.272612,2.89857 0.57793,2.586772 -1.362622,5.019171 -3.856587,5.539376 -3.312108,0.690858 -6.403673,-1.800676 -7.031504,-5.002549 -0.815679,-4.159881 2.321787,-8.019418 6.352623,-8.766731 5.139269,-0.952816 9.883623,2.932839 10.762696,7.922876 1.102691,6.259402 -3.640678,12.01342 -9.729291,13.036948 -4.254927,0.715276 -8.646078,-0.83766 -11.652926,-3.89782"
       transform="matrix(0.00300893,-1.7855747,-1.7855747,-0.00300893,<?php echo hexdec(substr($md5,14,2))/2.56+200; ?>,<?php echo hexdec(substr($md5,16,2))/2.56+100; ?>)" />
  </g>
  <g
     inkscape:groupmode="layer"
     id="layer4"
     inkscape:label="Text">
	 <text
		 x="50%" y="50%" dy=".36em"
         id="textspan42"
         style="font-size:80px;font-family:Arial;font-weight:bold;fill:#ffffff;text-anchor:middle; filter:url(#filter5096);"><?php echo $letter; ?></text>
  </g>
</svg>
