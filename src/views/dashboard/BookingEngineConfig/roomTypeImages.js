import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import '/node_modules/ag-grid-community/styles/ag-grid.css'
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    Card, CardHeader, CardTitle, Label, Col, Input, Row, Button,
    Accordion, AccordionBody, AccordionHeader, AccordionItem, CardBody,
    Form, InputGroup, Modal, ModalBody, ModalHeader, Spinner
} from 'reactstrap';
import API_URL from '../../../config';
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import classnames from "classnames";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/pages/page-form-validation.scss";
import { selectThemeColors } from "@utils";
import { useNavigate } from 'react-router-dom';


// ─── Room Type ID options fetched once at module level ───────────────────────
let roomTypeID = [];

fetchx(API_URL + '/getRoomInventoryRoomTypeID?hotelID=1')
    .then(result => result.json())
    .then(resp => {
        roomTypeID = resp['data'];
        console.log('roomTypeID options:', roomTypeID);
    });


// ─── Component ───────────────────────────────────────────────────────────────
const SubMatrix = (props) => {

    const [rowData, setRowData]                 = useState([]);
    const [data, setData]                       = useState(null);
    const [open, setOpen]                       = useState('');
    const [openModal, setOpenModal]             = useState(false);
    const [selectedRow, setSelectedRow]         = useState(null);

    // Insert form — selected file state
    const [selectedFile, setSelectedFile]       = useState(null);     // File object
    const [fileError, setFileError]             = useState('');        // validation msg
    const [uploading, setUploading]             = useState(false);     // upload in progress

    // Image-gallery state
    const [images, setImages]                   = useState([]);        // [{ imageID, fileName, url, isActive }]
    const [imageStatuses, setImageStatuses]     = useState({});        // { imageID: 0|1 }
    const [imagesLoading, setImagesLoading]     = useState(false);
    const [updatingImageID, setUpdatingImageID] = useState(null);

    // Image preview lightbox state
    const [previewImage, setPreviewImage]       = useState(null);
    const [openPreview, setOpenPreview]         = useState(false);

    const navigate  = useNavigate();
    const gridRef   = useRef();
    const fileInput = useRef();                                         // ref to reset <input type="file">

    // ── Forms ──────────────────────────────────────────────────────────────
    // Edit modal form
    const { reset, control, watch } = useForm({});

    // Insert accordion form
    const {
        handleSubmit: handleInsertSubmit,
        control: insertControl,
        reset: resetInsert,
        watch: watchInsert
    } = useForm();

    const selectedRoomTypeID = watchInsert('roomTypeID'); // watch for validation


    // ── Alerts ────────────────────────────────────────────────────────────
    const handleError = (message) => MySwal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        customClass: { confirmButton: 'btn btn-danger' },
        allowOutsideClick: false,
        confirmButtonText: 'Close',
        buttonsStyling: false
    });

    const handleSuccess = (text = 'Operation completed successfully!') => MySwal.fire({
        title: 'Success',
        text,
        icon: 'success',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
    });


    // ── AG-Grid config ────────────────────────────────────────────────────
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        filterParams: { buttons: ['apply', 'reset'] }
    }), []);


    // ── Fetch grid row data ───────────────────────────────────────────────
    const fetchData = () => {
        fetchx(API_URL + '/getS3ImageApp')
            .then(r => r.json())
            .then(res => setRowData(res['data'] || []));
    };

    useEffect(() => {
        fetchData();
    }, []);


    // ── File input change handler ─────────────────────────────────────────
    // Validates that the chosen file is an image (jpg/png/webp/gif etc.)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError('');
        setSelectedFile(null);

        if (!file) return;

        // Allow image MIME types only
        if (!file.type.startsWith('image/')) {
            setFileError('Please select a valid image file (JPG, PNG, WEBP, etc.).');
            if (fileInput.current) fileInput.current.value = '';
            return;
        }

        setSelectedFile(file);
    };


    // ── INSERT submit — upload image via multipart/form-data ──────────────
    // Server expects: req.file (the image buffer) + req.body.roomTypeID
    const onSubmit = async (formData) => {
        // Manual validation
        if (!formData.roomTypeID) {
            handleError('Please select a Room Type.');
            return;
        }
        if (!selectedFile) {
            setFileError('Please select an image file to upload.');
            return;
        }

        setUploading(true);

        try {
            // Build multipart/form-data — DO NOT set Content-Type header manually,
            // the browser sets it automatically with the correct boundary.
            const payload = new FormData();
            payload.append('file', selectedFile);               // matches req.file (multer)
            payload.append('roomTypeID', formData.roomTypeID.value); // matches req.body.roomTypeID

            const res      = await fetchx(API_URL + '/imguploadMobileApp', {
                method: 'POST',
                body: payload                                   // no Content-Type header here!
            });
            const respData = await res.json();

            if (respData.statusCode === 200) {
                handleSuccess('Image uploaded successfully!');
                // Reset form + file input
                resetInsert();
                setSelectedFile(null);
                setFileError('');
                setOpen('')
                if (fileInput.current) fileInput.current.value = '';
                fetchData();
            } else {
                handleError(respData.message || 'Upload failed.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            handleError('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };


    // ── Fetch images for a room type (from grouped SQL response) ──────────
    // Expected API response shape (after GROUP_CONCAT query):
    // {
    //   data: [{
    //     roomTypeID, roomTypeName, hotelID,
    //     roomImages:   "s3key1,s3key2,s3key3",
    //     isActiveList: "1,0,1",
    //     imageIDs:     "101,102,103"
    //   }]
    // }
    const parseGroupedImages = (row) => {
        if (!row || !row.imageIDs || !row.roomImages) return [];

        const ids       = String(row.imageIDs).split(',');
        const fileNames = String(row.roomImages).split(',');
        const statuses  = String(row.isActiveList || '').split(',');

        return ids.map((id, i) => ({
            imageID:  Number(id.trim()),
            fileName: (fileNames[i] || '').trim(),
            isActive: Number(statuses[i] ?? 1)
        }));
    };

    const fetchImagesForRoom = useCallback(async (roomTypeIDValue) => {
        setImagesLoading(true);
        setImages([]);
        setImageStatuses({});

        try {
            const res      = await fetchx(`${API_URL}/getS3ImageApp?roomTypeID=${roomTypeIDValue}`);
            const respData = await res.json();

            // API returns one grouped row per roomType
            const raw        = respData['data'];
            const groupedRow = Array.isArray(raw) ? raw[0] : raw;

            if (!groupedRow) {
                setImagesLoading(false);
                return;
            }

            const imageMetaList = parseGroupedImages(groupedRow);

            // Fetch blob URL for each image from S3/image server
            const fetched = await Promise.all(
                imageMetaList.map(async (meta) => {
                    try {
                        const imgRes = await fetchx(
                            `https://testhotel.prysmcable.com/v9/getImagesApp/${meta.fileName}`
                        );
                        const blob = await imgRes.clone().blob();

                        if (blob.type !== 'text/html') {
                            return {
                                imageID:  meta.imageID,
                                fileName: meta.fileName,
                                url:      URL.createObjectURL(blob),
                                isActive: meta.isActive
                            };
                        }
                    } catch (e) {
                        console.warn(`Failed to load image ${meta.fileName}`, e);
                    }
                    return null;
                })
            );

            const validImages = fetched.filter(Boolean);
            const statuses    = {};
            validImages.forEach(img => { statuses[img.imageID] = img.isActive; });

            setImages(validImages);
            setImageStatuses(statuses);

        } catch (err) {
            console.error('Error fetching room images:', err);
            handleError('Failed to load images for this room type.');
        } finally {
            setImagesLoading(false);
        }
    }, []);


    // ── Cell click → open edit modal ──────────────────────────────────────
    const cellClickedListener = useCallback((params) => {
        if (!params.data) return;

        setSelectedRow(params.data);

        reset({
            roomTypeID: {
                label: params.data.roomTypeName,
                value: params.data.roomTypeID
            }
        });

        setOpenModal(true);
        fetchImagesForRoom(params.data.roomTypeID);
    }, [reset, fetchImagesForRoom]);


    // ── Lightbox helpers ──────────────────────────────────────────────────
    const openImagePreview  = (img) => { setPreviewImage(img); setOpenPreview(true); };
    const closeImagePreview = ()    => { setOpenPreview(false); setPreviewImage(null); };

    const navigatePreview = (direction) => {
        const idx  = images.findIndex(img => img.imageID === previewImage.imageID);
        const next = (idx + direction + images.length) % images.length;
        setPreviewImage(images[next]);
    };


    // ── Column defs ───────────────────────────────────────────────────────
    const [columnDefs] = useState([
        { headerName: 'Room Type Name', field: 'roomTypeName',  },
        {
            headerName: 'Total Images',
            valueGetter: (params) => {
                if (!params.data?.imageIDs) return 0;
                return String(params.data.imageIDs).split(',').filter(Boolean).length;
            },
            maxWidth: 140,
            cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Actions',
            maxWidth: 140,
            cellRendererFramework: (params) => (
                <Button color="primary" size="sm" style={{ width: 90 }}
                    onClick={() => cellClickedListener(params)}>
                    Edit
                </Button>
            ),
            suppressSizeToFit: true,
            cellStyle: { textAlign: 'center' },
            cellClass: 'vertical-center'
        }
    ]);


    // ── Accordion toggle ──────────────────────────────────────────────────
    const toggle = (id) => setOpen(prev => prev === id ? '' : id);


    // ── UPDATE individual image isActive status ───────────────────────────
    const updateImageStatus = async (imageID) => {
        setUpdatingImageID(imageID);
        const isActive = imageStatuses[imageID];

        try {
            const res      = await fetchx(API_URL + '/updateRoomImageStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageID, isActive })
            });
            const respData = await res.json();

            if (respData.statusCode === 200) {
                handleSuccess(`Image status updated to ${isActive ? 'Active' : 'Inactive'}.`);
            } else {
                handleError(respData.message);
            }
        } catch (err) {
            handleError('Failed to update image status.');
        } finally {
            setUpdatingImageID(null);
        }
    };


    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div>

            {/* ══════════════════════════════════════
                INSERT ACCORDION — Room Type + Image upload
            ══════════════════════════════════════ */}
            <Accordion open={open} toggle={toggle}>
                <AccordionItem>
                    <AccordionHeader targetId="1">
                        <h4 className="mb-0 me-2"><b>Room Type Images</b></h4>
                        <Button color="primary" style={{ width: 160 }}>Add New</Button>
                    </AccordionHeader>

                    <AccordionBody accordionId="1">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Upload Room Image</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleInsertSubmit(onSubmit)}>
                                    <Row>

                                        {/* Room Type selector */}
                                        <Col md="4" sm="12" className="mb-1">
                                            <Label className="form-label" for="roomTypeID">
                                                Room Type <span className="text-danger">*</span>
                                            </Label>
                                            <Controller
                                                id="roomTypeID"
                                                control={insertControl}
                                                name="roomTypeID"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        isClearable
                                                        options={roomTypeID}
                                                        classNamePrefix="select"
                                                        theme={selectThemeColors}
                                                        placeholder="Select room type..."
                                                        className={classnames('react-select', {
                                                            'is-invalid': !selectedRoomTypeID
                                                        })}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </Col>

                                        {/* Image file picker — images only */}
                                        <Col md="4" sm="12" className="mb-1">
                                            <Label className="form-label" for="roomImage">
                                                Image File <span className="text-danger">*</span>
                                            </Label>

                                            <Input
                                                type="file"
                                                id="roomImage"
                                                accept="image/*"              // browser filter: images only
                                                innerRef={fileInput}          // ref so we can reset value
                                                onChange={handleFileChange}
                                                className={classnames('form-control', {
                                                    'is-invalid': !!fileError
                                                })}
                                            />

                                            {/* File error message */}
                                            {fileError && (
                                                <div className="invalid-feedback d-block">
                                                    {fileError}
                                                </div>
                                            )}

                                            {/* Preview of selected image before upload */}
                                            {selectedFile && (
                                                <div className="mt-2 d-flex align-items-center gap-2">
                                                    <img
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt="preview"
                                                        style={{
                                                            width: 64, height: 48,
                                                            objectFit: 'cover',
                                                            borderRadius: 6,
                                                            border: '1px solid #e2e8f0'
                                                        }}
                                                    />
                                                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                                                        {selectedFile.name}
                                                        <br />
                                                        <small>{(selectedFile.size / 1024).toFixed(1)} KB</small>
                                                    </span>
                                                </div>
                                            )}
                                        </Col>

                                        {/* Submit / Reset */}
                                        <Col xs="12" className="d-flex mt-2">
                                            <Button
                                                className="me-1"
                                                color="primary"
                                                type="submit"
                                                disabled={uploading}
                                            >
                                                {uploading
                                                    ? <><Spinner size="sm" className="me-1" />Uploading...</>
                                                    : 'Upload Image'
                                                }
                                            </Button>
                                            <Button
                                                outline color="secondary" type="reset"
                                                onClick={() => {
                                                    resetInsert();
                                                    setSelectedFile(null);
                                                    setFileError('');
                                                    if (fileInput.current) fileInput.current.value = '';
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </Col>

                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>


            {/* ══════════════════════════════════════
                EDIT MODAL — image gallery per room type
            ══════════════════════════════════════ */}
            <Modal
                isOpen={openModal}
                toggle={() => setOpenModal(!openModal)}
                className="modal-xl"
                scrollable
            >
                <ModalHeader toggle={() => setOpenModal(!openModal)}>
                    Images — {selectedRow?.roomTypeName}
                </ModalHeader>

                <ModalBody className="pb-3 px-sm-3">

                    <h5 className="fw-bold mb-3">
                        Room Images
                        {images.length > 0 && (
                            <span className="ms-2 text-muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>
                                ({images.length} image{images.length !== 1 ? 's' : ''})
                                &nbsp;—&nbsp;<small>click image to preview</small>
                            </span>
                        )}
                    </h5>

                    {/* Loading */}
                    {imagesLoading && (
                        <div className="text-center py-4">
                            <Spinner color="primary" />
                            <p className="text-muted mt-2 mb-0">Loading images...</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!imagesLoading && images.length === 0 && (
                        <div className="text-center py-4 rounded"
                            style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                            <p className="text-muted mb-0">No images found for this room type.</p>
                        </div>
                    )}

                    {/* Image cards grid */}
                    {!imagesLoading && images.length > 0 && (
                        <Row>
                            {images.map((img) => (
                                <Col md="3" sm="6" xs="12" key={img.imageID} className="mb-3">
                                    <Card className="h-100 shadow-sm"
                                        style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>

                                        {/* Clickable thumbnail */}
                                        <div
                                            onClick={() => openImagePreview(img)}
                                            title="Click to preview"
                                            style={{
                                                height: 160, background: '#e2e8f0',
                                                overflow: 'hidden', position: 'relative', cursor: 'pointer'
                                            }}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Room image ${img.imageID}`}
                                                style={{
                                                    width: '100%', height: '100%',
                                                    objectFit: 'cover', display: 'block',
                                                    transition: 'transform 0.25s ease'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />

                                            {/* Preview badge */}
                                            <div style={{
                                                position: 'absolute', top: 6, right: 6,
                                                background: 'rgba(0,0,0,0.55)', borderRadius: 6,
                                                padding: '2px 8px', color: '#fff',
                                                fontSize: '0.7rem', pointerEvents: 'none'
                                            }}>
                                                🔍 Preview
                                            </div>

                                            {/* Live status badge */}
                                            <div style={{
                                                position: 'absolute', bottom: 6, left: 6,
                                                background: imageStatuses[img.imageID]
                                                    ? 'rgba(22,163,74,0.85)' : 'rgba(220,38,38,0.85)',
                                                borderRadius: 99, padding: '2px 10px',
                                                color: '#fff', fontSize: '0.7rem',
                                                fontWeight: 600, pointerEvents: 'none'
                                            }}>
                                                {imageStatuses[img.imageID] ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>

                                        <CardBody className="p-2">
                                            <p className="text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                                                ID: <strong>{img.imageID}</strong>
                                                {img.fileName && (
                                                    <span className="ms-1 text-truncate d-inline-block"
                                                        style={{ maxWidth: 100, verticalAlign: 'bottom' }}
                                                        title={img.fileName}>
                                                        · {img.fileName}
                                                    </span>
                                                )}
                                            </p>

                                            <Label className="form-label small mb-1">Status</Label>
                                            <Input
                                                type="select" bsSize="sm"
                                                value={imageStatuses[img.imageID] ?? 1}
                                                onChange={(e) =>
                                                    setImageStatuses(prev => ({
                                                        ...prev,
                                                        [img.imageID]: Number(e.target.value)
                                                    }))
                                                }
                                                style={{ marginBottom: 8 }}
                                            >
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </Input>

                                            <Button
                                                color="primary" size="sm" className="w-100"
                                                disabled={updatingImageID === img.imageID}
                                                onClick={() => updateImageStatus(img.imageID)}
                                            >
                                                {updatingImageID === img.imageID
                                                    ? <><Spinner size="sm" className="me-1" />Saving...</>
                                                    : 'Update Status'
                                                }
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                </ModalBody>
            </Modal>


            {/* ══════════════════════════════════════
                IMAGE PREVIEW LIGHTBOX
            ══════════════════════════════════════ */}
            <Modal
                isOpen={openPreview}
                toggle={closeImagePreview}
                className="modal-xl"
                centered
                style={{ maxWidth: '92vw' }}
            >
                <ModalHeader toggle={closeImagePreview}>
                    Image Preview
                    {previewImage && (
                        <span className="ms-2 text-muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>
                            — ID: {previewImage.imageID}
                            {previewImage.fileName && ` · ${previewImage.fileName}`}
                        </span>
                    )}
                </ModalHeader>

                <ModalBody className="p-0 text-center"
                    style={{ background: '#0f172a', position: 'relative' }}>
                    {previewImage && (
                        <>
                            {/* Large image */}
                            <div style={{
                                minHeight: 400, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                padding: '16px 70px'
                            }}>
                                <img
                                    src={previewImage.url}
                                    alt={`Preview ${previewImage.imageID}`}
                                    style={{
                                        maxWidth: '100%', maxHeight: '68vh',
                                        objectFit: 'contain', borderRadius: 8,
                                        boxShadow: '0 8px 40px rgba(0,0,0,0.6)'
                                    }}
                                    onError={e => { e.target.src = ''; }}
                                />
                            </div>

                            {/* Prev */}
                            {images.length > 1 && (
                                <button onClick={() => navigatePreview(-1)} title="Previous"
                                    style={{
                                        position: 'absolute', left: 12, top: '45%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: 'none', borderRadius: 8, color: '#fff',
                                        fontSize: '2rem', padding: '8px 16px',
                                        cursor: 'pointer', backdropFilter: 'blur(6px)',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                >‹</button>
                            )}

                            {/* Next */}
                            {images.length > 1 && (
                                <button onClick={() => navigatePreview(1)} title="Next"
                                    style={{
                                        position: 'absolute', right: 12, top: '45%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: 'none', borderRadius: 8, color: '#fff',
                                        fontSize: '2rem', padding: '8px 16px',
                                        cursor: 'pointer', backdropFilter: 'blur(6px)',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                >›</button>
                            )}

                            {/* Thumbnail strip */}
                            {images.length > 1 && (
                                <div style={{
                                    display: 'flex', gap: 8, overflowX: 'auto',
                                    padding: '10px 16px',
                                    background: 'rgba(0,0,0,0.45)',
                                    justifyContent: 'center', flexWrap: 'wrap'
                                }}>
                                    {images.map((img) => (
                                        <img key={img.imageID} src={img.url}
                                            alt={`thumb-${img.imageID}`}
                                            onClick={() => setPreviewImage(img)}
                                            title={`ID: ${img.imageID}`}
                                            style={{
                                                width: 68, height: 50,
                                                objectFit: 'cover', borderRadius: 6,
                                                cursor: 'pointer', flexShrink: 0,
                                                border: previewImage?.imageID === img.imageID
                                                    ? '2px solid #3b82f6' : '2px solid transparent',
                                                opacity: previewImage?.imageID === img.imageID ? 1 : 0.55,
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={e => {
                                                if (previewImage?.imageID !== img.imageID)
                                                    e.currentTarget.style.opacity = '1';
                                            }}
                                            onMouseLeave={e => {
                                                if (previewImage?.imageID !== img.imageID)
                                                    e.currentTarget.style.opacity = '0.55';
                                            }}
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Info bar */}
                            <div style={{
                                background: 'rgba(0,0,0,0.65)', color: '#94a3b8',
                                fontSize: '0.8rem', padding: '8px 20px',
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', flexWrap: 'wrap', gap: 8
                            }}>
                                <span>
                                    Image ID: <strong style={{ color: '#e2e8f0' }}>{previewImage.imageID}</strong>
                                    {previewImage.fileName && (
                                        <span className="ms-2" style={{ color: '#64748b' }}>
                                            {previewImage.fileName}
                                        </span>
                                    )}
                                </span>
                                <span style={{
                                    padding: '2px 14px', borderRadius: 99,
                                    fontSize: '0.75rem', fontWeight: 600,
                                    background: imageStatuses[previewImage.imageID]
                                        ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)',
                                    color: imageStatuses[previewImage.imageID] ? '#4ade80' : '#f87171'
                                }}>
                                    {imageStatuses[previewImage.imageID] ? '● Active' : '● Inactive'}
                                </span>
                                {images.length > 1 && (
                                    <span>
                                        {images.findIndex(i => i.imageID === previewImage.imageID) + 1}
                                        {' / '}{images.length}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </ModalBody>
            </Modal>

            <br />

            {/* ── AG Grid ── */}
            <div className="ag-theme-alpine" style={{ height: 520 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection="multiple"
                    onCellClicked={cellClickedListener}
                    paginationPageSize={10}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    headerColor="ddw-primary"
                    masterDetail={true}
                    onGridReady={(params) => { gridRef.current = params.api; }}
                />
            </div>

        </div>
    );
};

export default SubMatrix;
