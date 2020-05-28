import React from "react";
import { Modal } from "react-responsive-modal";
import useInputState from "../../hooks/useInputState";
import "react-responsive-modal/styles.css";
import axios from "axios";
import { addSitemap, scrapData } from "./../../utils/routes";
import { toast } from "react-toastify";

export default function Form(props) {
  const [title, handleTitleChange, rT] = useInputState("");
  const [link, handleLinkChange, rL] = useInputState("");
  const [algo, handleAlgoChange, rA] = useInputState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = { link, title, algo };
    try {
      await axios.post(addSitemap, body);
      axios.post(scrapData, { url: link });
      props.toggleModal(false);
      rA();
      rL();
      rT();
      toast.success("Sitemap Added");
      window.location = "/home";
    } catch (error) {
      props.toggleModal(false);
      rA();
      rL();
      rT();
      toast.error("Something went wrong");
    }
  };
  const style = {
    modal: {
      background: "#e7f6fd",
      maxWidth: "900px",
      width: "100%",
      borderRadius: "4px",
    },
  };

  return (
    <Modal
      open={props.modalIsOpen}
      onClose={() => props.toggleModal(false)}
      center
      styles={style}
    >
      <div className="container">
        <div>
          <div className="row">
            <div className="col-lg-8 col-md-7 col-12">
              <p className="h4 mt-4">Algorithm Types</p>
              <p className="h5">Type 1:</p>
            </div>
            <div className="col-lg-4 col-md-5 col-12 pb-4">
              <div className="col-lg-12">
                <h4 className=" mt-4 mb-4">
                  {" "}
                  <strong>Add Sitemap</strong>
                </h4>
              </div>
              <form>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label htmlFor="name">Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label htmlFor="email">Url:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={link}
                      onChange={handleLinkChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 mb-4">
                  <label style={{ color: "rgb(66, 63, 63)" }}>
                    <strong>Algorithm</strong>
                  </label>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="1"
                          id="exampleRadios1"
                          value="1"
                          onChange={handleAlgoChange}
                        />
                        <label className="form-check-label">1</label>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="3"
                          id="exampleRadios2"
                          value="2"
                          onChange={handleAlgoChange}
                        />
                        <label className="form-check-label">2</label>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="3"
                          id="exampleRadios3"
                          value="3"
                          onChange={handleAlgoChange}
                        />
                        <label className="form-check-label">3</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-4">
                  <button
                    type="submit"
                    className={`btn btn-outline-primary btn-block`}
                    onClick={handleSubmit}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
